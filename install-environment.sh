#!/bin/bash

# Attempt to catch people running the script via sudo and abort
[[ $(whoami) == "root" ]] && echo "This script should not be run as root or via the 'sudo' command; aborting..." && exit

# Attempt to catch people running the script from somewhere other than the Desktop
[[ $(basename $(pwd)) != "Desktop" ]] && echo "This script should be run from the Desktop; aborting..." && exit

# Attempt to catch people running the script directly instead of via the 'source' command
[[ $(basename $0 2>/dev/null) == "install-Mac-auto.sh" ]] && echo "This script should be run via the 'source' command; aborting..." && exit

# Make sure Xcode has been installed already
[[ ! -r /Applications/Xcode.app ]] && echo "You need to install Xcode from the App Store first; aborting..." && exit

# Make sure the Command-Line Tools have been installed
[[ ! -r /usr/bin/svn ]] && echo "You need to install the Command-Line Tools in Xcode first; aborting..." && echo "See: http://stackoverflow.com/a/9329325" && exit

# Determine if the user wants to "force" the script, meaning in certain areas we blow away what exists and replace it
function useTheForce {
    echo ""
    echo "##  WARNING!  ##"
    echo "##  You've elected to use the force!  This will wipe away certain portions"
    echo "##  of whatever installation of the development environment you already have"
    echo "##  to replace those portions entirely.  Currently, that list includes removal"
    echo "##  and replacement of the following:"
    echo "##    > /tools folder"
    echo "##    > /svnwork folder (and all child folders)"
    echo "##    > Subversion configuration"
    echo "##    > Maven configuration"
    echo "##    > Additional installation resources (mac-dev-install folder)"
    echo "##    > Bash dotfiles (.bashrc and/or .bash_profile)"
    echo "##    > WebRunner port-redirection script"
    echo ""
    read -p "Are you sure you wish to continue? ('y' or 'n'): " FORCE_CONT
    if [[ $FORCE_CONT == "y" ]]; then
        unset FORCE_CONT
        FORCE=true
    else
        unset FORCE_CONT
        exit
    fi
}
[[ "$*" == *--force* ]] && useTheForce

function configureMaven {
    keepSudoAlive
    cd $INSTALLDIR
    echo "Configuring Maven... " >> $LOGFILE
    # Only write the ~/.mavenrc file if it doesn't already exist or if we have the FORCE
    echo -n "  Writing $HOME/.mavenrc... " >> $LOGFILE
    if [[ ! -f $HOME/.mavenrc ]]; then
        echo MAVEN_OPTS="\"-Xms256m -Xmx2g -XX:MaxPermSize=256m -server\"" > $HOME/.mavenrc && cmdpass || cmdfail
    elif [[ $FORCE ]]; then
        echo MAVEN_OPTS="\"-Xms256m -Xmx2g -XX:MaxPermSize=256m -server\"" > $HOME/.mavenrc && cmdpass || cmdfail
    else
        echo "already exists?" >> $LOGFILE
    fi
    # Only copy the Maven settings file over if it doesn't already exist
    if [[ ! -f ~/.m2/settings.xml ]]; then
        echo -n "  Creating Maven settings folder... " >> $LOGFILE
        mkdir -p ~/.m2 && cmdpass || cmdfail
        echo -n "  Installing Maven settings file... " >> $LOGFILE
        cp -Rp ts-maven-settings.xml ~/.m2/settings.xml && cmdpass || cmdfail
    elif [[ $FORCE ]]; then
        echo -n "  Creating Maven settings folder... " >> $LOGFILE
        mkdir -p ~/.m2 && cmdpass || cmdfail
        echo -n "  Installing Maven settings file... " >> $LOGFILE
        cp -Rp ts-maven-settings.xml ~/.m2/settings.xml && cmdpass || cmdfail
    fi
    # Install the Maven repo's SSL cert to the Java keystore
    keytool -list -storepass "changeit" -keystore $JAVA_HOME/lib/security/cacerts | grep "bvrepo" > /dev/null
    if [[ $? == 1 ]]; then
        echo -n "  Installing local Maven certificate... " >> $LOGFILE
        echo "yes" | sudo keytool -import -alias bvrepo -storepass "changeit" -keystore $JAVA_HOME/lib/security/cacerts -file $INSTALLDIR/repo-ssl.cer && cmdpass || cmdfail
    else
        echo "Skipped installing local Maven certificate; already installed." >> $LOGFILE
    fi
}

function installXmlbeans {
    keepSudoAlive
    echo "Installing Xmlbeans 2.5.0... " >> $LOGFILE
    if [ ! -d "/tools/xmlbeans-2.5.0" ]; then
        cd $INSTALLDIR
        echo -n "  Downloading... " >> $LOGFILE
        curl -LO http://www.apache.org/dist/xmlbeans/binaries/xmlbeans-2.5.0.zip && cmdpass || cmdfail
        echo -n "  Decompressing and moving to /tools directory... " >> $LOGFILE
        unzip xmlbeans-2.5.0.zip && mv xmlbeans-2.5.0 /tools && cmdpass || cmdfail
        echo -n "  Making xmlbeans apps executable... " >> $LOGFILE
        chmod u+x /tools/xmlbeans*/bin/* && chmod u-x /tools/xmlbeans*/bin/*.cmd && cmdpass || cmdfail
    else
        echo "  Xmlbeans 2.5.0 install skipped; already installed. " >> $LOGFILE
    fi
}

# Set Xcode.app as the location for "Developer" resources
# Show the Xcode license for acceptance
function configureXcode {
    keepSudoAlive
    echo -n "Selecting Xcode.app as the Developer folder... " >> $LOGFILE
    sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer && cmdpass || cmdfail
    echo -n "Displaying Command-Line Tools license... " >> $LOGFILE
    sudo xcodebuild -license && cmdpass || cmdfail
}

function installHomebrew {
    keepSudoAlive
    echo -n "Installing Homebrew... " >> $LOGFILE
    sudo /bin/mkdir /usr/local && sudo /bin/chmod g+rwx /usr/local && sudo /usr/bin/chgrp admin /usr/local && curl -L https://github.com/mxcl/homebrew/tarball/master | tar xz --strip 1 -C /usr/local && cmdpass || cmdfail
}

function cmdpass {
    echo "SUCCESS" >> $LOGFILE
}

function cmdfail {
    echo "FAIL" >> $LOGFILE
}

# MAKE LOG FOLDER
if [ ! -d $HOME/.mac-dev-install ]; then
    mkdir $HOME/.mac-dev-install
fi

# DEFINE THE LOGFILE
CURRDATE=$(date +%Y-%m-%d-%H%M%S)
LOGFILE="$HOME/.mac-dev-install/install-environment-$CURRDATE.log"

# START THE LOG FILE; SPAWN LOG WINDOW
echo "Starting log file and opening watcher... "
echo "Mac OS X Bazaarvoice Dev Environment Setup Script" > $LOGFILE
echo "Started install at: $CURRDATE" >> $LOGFILE
echo "" >> $LOGFILE
osascript -e "tell app \"Terminal\"
    do script \"tail -f $LOGFILE\"
end tell"

# DETECT ARCHITECTURE
echo -n "Determining system information... " >> $LOGFILE
ARCH="`uname -m`"

# DETECT VERSION OF OS X
OSX_VER=$(system_profiler -detailLevel -2 | grep 'System Version' | cut -d : -f 2 | cut -c 2-)
OSX_VER_NUM=$(echo $OSX_VER | tr ' ' "\n" | egrep '([0-9]+\.)([0-9]+\.?){1,2}')
OSX_MIN_VER_NUM=$(echo $OSX_VER_NUM | cut -d. -f2)

# DETECT HARDWARE
HARDWARE=$(system_profiler -detailLevel -2 | grep 'Model Identifier' | cut -d : -f 2 | cut -c 2-)

echo "SUCCESS" >> $LOGFILE

# SET INSTALL FOLDER PATH
INSTALLDIR="$HOME/Desktop/mac-dev-install"

# WRITE VARIABLES TO LOG FILE
echo "" >> $LOGFILE
echo "-------- DETECTED VARIABLES --------" >> $LOGFILE
echo "Architecture:              $ARCH" >> $LOGFILE
echo "OS X full version:         $OSX_VER" >> $LOGFILE
echo "OS X major version:        $OSX_VER_NUM" >> $LOGFILE
echo "Hardware:                  $HARDWARE" >> $LOGFILE
echo "Install dir:               $INSTALLDIR" >> $LOGFILE
echo "" >> $LOGFILE

function keepSudoAlive {
    sudo -S -v -p "Enter an administrator password for %u on this computer: "
    # IF GETTING SUDO FAILED, HOLD THE USER IN A LOOP UNTIL THEY PROVIDE CORRECT ADMIN PASSWORD
    while [[ $? == 1 ]]; do
        echo ""
        echo "##  ATTENTION!  ##"
        echo "##  Your password for this computer is being rejected or the 'sudo' prompt has timed out."
        echo "##  Please make sure you're typing the correct password to access this computer"
        echo "##  (should match your Active Directory / Outlook password)."
        echo ""
        read -p "Would you like to try your password again? ('y' or 'n'): " COMP_CONT
        if [[ $COMP_CONT == "y" ]]; then
            unset COMP_CONT
            sudo -S -v -p "Enter an administrator password for %u on this computer: "
        else
            unset COMP_CONT
            exit
        fi
    done
}

keepSudoAlive

# Figure out if this is for TS or not
FOR_TS=""
function forTs {
    read -p "Is this machine for TS? ('y' or 'n'): " FOR_TS
    [[ ! $FOR_TS == "y" ]] && [[ ! $FOR_TS == "n" ]] && forTs
}
forTs

# Set up Xcode
configureXcode

# Install Homebrew
installHomebrew

# MAKE /tools FOLDER
function createToolsFolder {
    echo -n "Making /tools folder... " >> $LOGFILE
    sudo mkdir /tools && cmdpass || cmdfail
    echo -n "Setting $USER as /tools folder owner... " >> $LOGFILE
    sudo chown -R $USER /tools && cmdpass || cmdfail
}
if [ ! -d /tools ]; then
    createToolsFolder
elif [[ $FORCE ]]; then
    echo -n "Using the force and wiping out /tools folder... " >> $LOGFILE
    sudo rm -rf /tools && cmdpass || cmdfail
    createToolsFolder
else
    echo "Skipped /tools folder creation; /tools already exists. " >> $LOGFILE
fi

# Install xmlbeans
installXmlbeans

# MAKE /svnwork FOLDER
# FROM HERE ON OUT, WE DON'T NEED TO ENABLE FORCED CREATION OF ANYTHING IN SVNWORK SINCE WE BLOW IT AWAY AT THIS POINT
function createSvnworkFolder {
    echo -n "Making /svnwork folder... " >> $LOGFILE
    sudo mkdir /svnwork && cmdpass || cmdfail
    echo -n "Setting $USER as /svnwork folder owner... " >> $LOGFILE
    sudo chown -R $USER /svnwork && cmdpass || cmdfail
}
if [ ! -d /svnwork ]; then
    createSvnworkFolder
elif [[ $FORCE ]]; then
    echo -n "Using the force and wiping out /svnwork folder... " >> $LOGFILE
    sudo rm -rf /svnwork && cmdpass || cmdfail
    keepSudoAlive
    createSvnworkFolder
else
    echo "Skipped /svnwork folder creation; /svnwork already exists. " >> $LOGFILE
fi

# CONFIGURE SUBVERSION
function configureSubversionAuth {
    echo -n "Configuring subversion auth... " >> $LOGFILE
    svn ls https://dev.bazaarvoice.com/svn/bvc/ > /dev/null && cmdpass || cmdfail
    if [ ! -e $HOME/.subversion/auth/svn.simple/* ]; then
        echo ""
        echo "##  ATTENTION!  ##"
        echo "##  Subversion is rejecting your username and password.  Please make sure"
        echo "##  you're typing the correct username and password to access subversion"
        echo "##  (it's not always the same as LDAP)."
        echo ""
        read -p "Would you like to try entering your subversion credentials again? ('y' or 'n'): " SVN_CONT
        if [[ $SVN_CONT == "y" ]]; then
            unset SVN_CONT
            configureSubversionAuth
        else
            unset SVN_CONT
            exit
        fi
    fi
}
function configureSubversion {
    svn --version
    echo -n "Enabling storing of plaintext SVN password... " >> $LOGFILE
    echo "store-plaintext-passwords = yes" >> $HOME/.subversion/servers && cmdpass || cmdfail
    echo -n "Installing BV subversion config... " >> $LOGFILE
    svn cat https://dev.bazaarvoice.com/svn/bvc/ops/trunk/scm/client/config > $HOME/.subversion/config && cmdpass || cmdfail
}
if [[ ! -d $HOME/.subversion ]]; then
    configureSubversionAuth
    configureSubversion
elif [ ! -e $HOME/.subversion/auth/svn.simple/* ]; then
    configureSubversionAuth
    configureSubversion
elif [[ $FORCE ]]; then
    echo -n "Using the force and wiping out $HOME/.subversion folder... " >> $LOGFILE
    sudo rm -rf $HOME/.subversion && cmdpass || cmdfail
    configureSubversionAuth
    configureSubversion
else
    echo "Skipped subversion configuration; $HOME/.subversion already exists. " >> $LOGFILE
fi
    
# CHECKOUT THE REST OF THE SETUP FROM REPOSITORY; DEPENDENT ON SUBVERSION CONFIGURATION ABOVE
function getInstallResources {
    echo -n "Downloading additional install resources from subversion... " >> $LOGFILE
    svn export https://dev.bazaarvoice.com/svn/bvc/techservices/trunk/tools/misc/mac-dev-install $HOME/Desktop/mac-dev-install && cmdpass || cmdfail
}
if [[ -d $HOME/Desktop/mac-dev-install ]]; then
    echo -n "Wiping out existing mac-dev-install folder... " >> $LOGFILE
    sudo rm -rf $HOME/Desktop/mac-dev-install && cmdpass || cmdfail
    getInstallResources
else
    getInstallResources
fi

# INSTALL JAVA IF ON 10.7 OR LATER
keepSudoAlive
function installJava {
    sudo /usr/libexec/java_home -F
    if [[ $? == 1 ]]; then
        echo "Installing Java (opens new window that doesn't return a status)... " >> $LOGFILE
        java
    else
        echo "Java appears to already be installed; skipped." >> $LOGFILE
    fi
}
[[ $OSX_MIN_VER_NUM -ge "7" ]] && installJava

# INSTALL SOFTWARE
selectAndInstallAdditionalSoftware

# UTILITY FUNCTION FOR SVN PROJECTS BELOW
function setUpIfDoesNotExistOrUserRequests {
    keepSudoAlive
    if [[ ! -d $1 ]]; then
        $2
    elif [[ $FORCE ]]; then
        echo -n "Removing current $1 folder... " >> $LOGFILE
        sudo rm -rf $1 && cmdpass || cmdfail
        $2
    elif [[ $(read -p "The directory '$1' already exists; would you like to replace it? ('y' or 'n'): " TEMPVAR && echo "$TEMPVAR" && unset TEMPVAR) == "y" ]]; then
        echo -n "Removing current $1 folder... " >> $LOGFILE
        sudo rm -rf $1 && cmdpass || cmdfail
        $2
    else
        echo "Skipped setting up $1; already exists. " >> $LOGFILE
    fi
}

# SET UP TECHSERVICES PROJECT
function setUpTsProject {
    echo -n "Setting up directory structure for techservices project... " >> $LOGFILE
    sudo mkdir -p /svnwork/techservices/trunk && sudo chown -R $USER /svnwork/techservices && cmdpass || cmdfail
    echo -n "Checking out the techservices project... " >> $LOGFILE
    svn co https://dev.bazaarvoice.com/svn/bvc/techservices/trunk /svnwork/techservices/trunk/working && cmdpass || cmdfail
    echo -n "Granting execute permissions on techservices tools... " >> $LOGFILE
    chmod -R u+rwx /svnwork/techservices/trunk/working/tools && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /svnwork/techservices setUpTsProject

# SET UP SAVANA
function setUpSavProject {
    echo -n "Setting up directory structure for svnscripts project... " >> $LOGFILE
    sudo mkdir -p /svnwork/svnscripts/trunk && sudo chown -R $USER /svnwork/svnscripts && cmdpass || cmdfail
    echo -n "Checking out the svnscripts project... " >> $LOGFILE
    svn co https://dev.bazaarvoice.com/svn/bvc/svnscripts/trunk /svnwork/svnscripts/trunk/working && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /svnwork/svnscripts setUpSavProject

# SET UP CUSTOMERS
function setUpCustomersProject {
    echo -n "Setting up directory structure for customers... " >> $LOGFILE
    sudo mkdir -p /svnwork/customers && sudo chown -R $USER /svnwork/customers && cmdpass || cmdfail
    echo -n "Checking out trunk customers clean... " >> $LOGFILE
    if [[ $FOR_TS == "y" ]]; then
        svn co --depth immediates https://dev.bazaarvoice.com/svn/bvc/customers/trunk /svnwork/customers/trunk/clean && pushd /svnwork/customers/trunk/clean && svn up testcustomer* bvproductstyles && popd && cmdpass || cmdfail
    else
        svn co https://dev.bazaarvoice.com/svn/bvc/customers/trunk /svnwork/customers/trunk/clean && cmdpass || cmdfail
    fi
    echo -n "Copying trunk customers clean to working... " >> $LOGFILE
    cp -Rp /svnwork/customers/trunk/clean /svnwork/customers/trunk/working && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /svnwork/customers setUpCustomersProject

# DETECT LATEST BRANCH TAG
echo -n "Detecting latest branch tag... " >> $LOGFILE
LATEST_SVN_TAGNUM="$(svn ls https://dev.bazaarvoice.com/svn/bvc/prr/tags | grep "fullsuite" | grep "verified" | sed 's/\/$//g' | cut -d'-' -f2- | sort -n | tail -1)"
if [[ $LATEST_SVN_TAGNUM ]]; then
    LATEST_VERIFIED_TAG="fullsuite-$LATEST_SVN_TAGNUM"
    echo "SUCCESS (found ${LATEST_VERIFIED_TAG})" >> $LOGFILE
else
    echo "FAIL" >> $LOGFILE
fi

# SET UP PRR
function setUpPrrProject {
    echo -n "Setting up directory structure for prr... " >> $LOGFILE
    sudo mkdir -p /svnwork/prr && sudo chown -R $USER /svnwork/prr && cmdpass || cmdfail
    if [[ $FOR_TS == "n" ]]; then
        echo -n "Checking out trunk prr... " >> $LOGFILE
        svn co https://dev.bazaarvoice.com/svn/bvc/prr/trunk /svnwork/prr/trunk/working && cmdpass || cmdfail
    fi
    echo -n "Checking out latest verified tag (${LATEST_VERIFIED_TAG}) prr... " >> $LOGFILE
    svn co https://dev.bazaarvoice.com/svn/bvc/prr/tags/$LATEST_VERIFIED_TAG /svnwork/prr/branch/working && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /svnwork/prr setUpPrrProject

# SET UP DEFAULTUI
function setUpDefaultUiProject {
    echo -n "Setting up directory structure for defaultui... " >> $LOGFILE
    sudo mkdir -p /svnwork/defaultui && sudo chown -R $USER /svnwork/defaultui && cmdpass || cmdfail
    if [[ $FOR_TS == "n" ]]; then
        echo -n "Checking out trunk defaultui clean... " >> $LOGFILE
        svn co https://dev.bazaarvoice.com/svn/bvc/defaultui/trunk /svnwork/defaultui/trunk/clean && cmdpass || cmdfail
        echo -n "Copying trunk defaultui clean to working... " >> $LOGFILE
        cp -Rp /svnwork/defaultui/trunk/clean /svnwork/defaultui/trunk/working && cmdpass || cmdfail
    fi
    echo -n "Checking out latest verified tag (${LATEST_VERIFIED_TAG}) defaultui clean... " >> $LOGFILE
    svn co https://dev.bazaarvoice.com/svn/bvc/defaultui/tags/${LATEST_VERIFIED_TAG} /svnwork/defaultui/branch/clean && cmdpass || cmdfail
    echo -n "Copying latest verified tag (${LATEST_VERIFIED_TAG}) defaultui clean to working... " >> $LOGFILE
    cp -Rp /svnwork/defaultui/branch/clean /svnwork/defaultui/branch/working && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /svnwork/defaultui setUpDefaultUiProject

# UNMOUNT MAC OS X'S DEFAULT /home DIRECTORY
# See:
#   http://expressionengine.com/archived_forums/viewthread/74357/
#   http://apple.stackexchange.com/questions/10445/what-is-the-function-of-home-in-snow-leopard?tab=votes#tab-top
#   http://lowendmac.com/ed/winston/09kw/intro-to-autofs.html
keepSudoAlive
# Test ability to write to /home
sudo touch /home/tmpfile > /dev/null 2>&1
# If the previous command failed, then execute steps to move autofs-assigned /home to /home-alt
if [[ $? == 1 ]]; then
    echo -n "Attempting to reassign autofs-assigned /home to /home-alt... " >> $LOGFILE
    sudo sed -i '' 's/\/home/\/home-alt/' /etc/auto_master && sudo automount -vc && cmdpass || cmdfail
    echo -n "Testing for real /home directory... " >> $LOGFILE
    sudo touch /home/tmpfile && if [ -f /home/tmpfile ]; then sudo rm /home/tmpfile && cmdpass; else cmdfail && echo -n "Autofs still controls /home; trying desperate approach... " >> $LOGFILE && sudo umount /home/ && cmdpass || cmdfail; fi
else
    echo "Autofs-assigned /home directory appears to have been moved already; skipped." >> $LOGFILE
fi

# SETUP /home/bazaarvoice
keepSudoAlive
function setUpBazaarvoiceHome {
    echo -n "Creating directory structure for /home/bazaarvoice... " >> $LOGFILE
    sudo mkdir -p /home/bazaarvoice && sudo chown -R $USER /home/bazaarvoice && mkdir -p /home/bazaarvoice/config-branch /home/bazaarvoice/config-trunk /home/bazaarvoice/customers-trunk /home/bazaarvoice/promote-logs /home/bazaarvoice/reports /home/bazaarvoice/logs/diagnostic /home/bazaarvoice/logs/request && cmdpass || cmdfail
    echo -n "Setting up config-branch... " >> $LOGFILE
    cd /home/bazaarvoice/config-branch && mkdir -p 10-localhost && cp /svnwork/prr/branch/working/metadata/home/config/30-common/log4j.xml 10-localhost && ln -s /svnwork/prr/branch/working/metadata/home/config/15-overrides-dev-dbscripts /home/bazaarvoice/config-branch/15-overrides-dev-dbscripts && ln -s /svnwork/prr/branch/working/metadata/home/config/20-overrides-dev /home/bazaarvoice/config-branch/20-overrides-dev && ln -s /svnwork/prr/branch/working/metadata/home/config/25-overrides-dev-lab-austin /home/bazaarvoice/config-branch/25-overrides-dev-lab-austin && ln -s /svnwork/prr/branch/working/metadata/home/config/30-common /home/bazaarvoice/config-branch/30-common && cmdpass || cmdfail
    echo -n "Copying env.xml, host_overrides.properties, portal_endpoints.properties, and jetty.properties for config-branch... " >> $LOGFILE
    cp $INSTALLDIR/env.xml $INSTALLDIR/host_overrides.properties $INSTALLDIR/portal_endpoints.properties $INSTALLDIR/jetty.properties /home/bazaarvoice/config-branch/10-localhost && cmdpass || cmdfail
    echo -n "Writing production_secret_key.bin for config-branch... " >> $LOGFILE
    echo "3c774ac04349bbbf861cd59cb7594d09892139227b3dda3411e3f0cdf96da54a" > /home/bazaarvoice/config-branch/production_secret_key.bin && cmdpass || cmdfail
    if [[ $FOR_TS == "n" ]]; then
        echo -n "Setting up config-trunk... " >> $LOGFILE
        cd /home/bazaarvoice/config-trunk && mkdir -p 10-localhost && cp /svnwork/prr/trunk/working/metadata/home/config/30-common/log4j.xml 10-localhost && ln -s /svnwork/prr/trunk/working/metadata/home/config/15-overrides-dev-dbscripts /home/bazaarvoice/config-trunk/15-overrides-dev-dbscripts && ln -s /svnwork/prr/trunk/working/metadata/home/config/20-overrides-dev /home/bazaarvoice/config-trunk/20-overrides-dev && ln -s /svnwork/prr/trunk/working/metadata/home/config/25-overrides-dev-lab-austin /home/bazaarvoice/config-trunk/25-overrides-dev-lab-austin && ln -s /svnwork/prr/trunk/working/metadata/home/config/30-common /home/bazaarvoice/config-trunk/30-common && cmdpass || cmdfail
        echo -n "Copying env.xml host_overrides.properties, portal_endpoints.properties, and jetty.properties for config-trunk... " >> $LOGFILE
        cp $INSTALLDIR/env.xml $INSTALLDIR/host_overrides.properties $INSTALLDIR/portal_endpoints.properties $INSTALLDIR/jetty.properties /home/bazaarvoice/config-trunk/10-localhost && cmdpass || cmdfail
        echo -n "Writing production_secret_key.bin for config-trunk... " >> $LOGFILE
        echo "3c774ac04349bbbf861cd59cb7594d09892139227b3dda3411e3f0cdf96da54a" > /home/bazaarvoice/config-trunk/production_secret_key.bin && cmdpass || cmdfail
    fi
    echo -n "Setting up symbolic links in /home/bazaarvoice for branch use... " >> $LOGFILE
    cd /home/bazaarvoice && ln -s /svnwork/customers/trunk/working customers && ln -s config-branch config && ln -s /svnwork/defaultui/branch/working defaultui && cmdpass || cmdfail
}
setUpIfDoesNotExistOrUserRequests /home/bazaarvoice setUpBazaarvoiceHome

# COPY dotfiles
function setUpDotFiles {
    echo -n "Setting up bash dotfiles (.bash_profile and .bashrc)... " >> $LOGFILE
    cp $INSTALLDIR/bash_profile $HOME/.bash_profile && cp $INSTALLDIR/bashrc $HOME/.bashrc && source $HOME/.bash_profile && cmdpass || cmdfaill
}
if [ ! -f $HOME/.bashrc ] || [ ! -f $HOME/.bash_profile ]; then
    setUpDotFiles
elif [[ $FORCE ]]; then
    echo -n "Using the force and wiping out bash dotfiles... " >> $LOGFILE
    sudo rm -f $HOME/.bashrc $HOME/.bash_profile && cmdpass || cmdfail
    setUpDotFiles
else
    echo "Dotfiles (.bashrc and/or .bash_profile) already exist; skipped." >> $LOGFILE
fi

# SETUP MAVEN
configureMaven

# INSTALL PortRedir
keepSudoAlive
function installPortRedir {
    echo -n "Installing PortRedir script... " >> $LOGFILE
    sudo mkdir -p /Library/StartupItems/PortRedir && sudo sudo cp $INSTALLDIR/PortRedir /Library/StartupItems/PortRedir && sudo chgrp -R wheel /Library/StartupItems/PortRedir/ && sudo chown -R root /Library/StartupItems/PortRedir && sudo chmod a+rx /Library/StartupItems/PortRedir/PortRedir && cmdpass || cmdfail
    echo '@reboot /Library/StartupItems/PortRedir/PortRedir' | sudo crontab && cmdpass || cmdfail
}
if [[ ! -d /Library/StartupItems/PortRedir ]]; then
    installPortRedir
elif [[ $FORCE ]]; then
    echo -n "Using the force and wiping out /Library/StartupItems/PortRedir folder... " >> $LOGFILE
    sudo rm -rf /Library/StartupItems/PortRedir && cmdpass || cmdfail
    installPortRedir
else
    echo "Skipped installing PortRedir script; already installed. " >> $LOGFILE
fi

# INSTALL LOCAL LDAP CERTIFICATE
keytool -list -storepass "changeit" -keystore $JAVA_HOME/lib/security/cacerts | grep "shareddev" > /dev/null
if [[ $? == 1 ]]; then
    echo -n "Installing local LDAP certificate... " >> $LOGFILE
    echo "yes" | sudo keytool -import -alias shareddev -storepass "changeit" -keystore $JAVA_HOME/lib/security/cacerts -file $INSTALLDIR/labCA.pem && cmdpass || cmdfail
else
    echo "Skipped installing local LDAP certificate; already installed." >> $LOGFILE
fi

# UN-SUDO AND DELETE STORED CREDENTIALS
echo -n "Removing sudo privileges... " >> $LOGFILE
sudo -k && cmdpass || cmdfail
echo -n "Removing temporary SVN credentials... " >> $LOGFILE
rm $HOME/.subversion/auth/svn.simple/* && cmdpass || cmdfail

# PRINT DIAGNOSTICS
echo "" >> $LOGFILE
echo "Install completed at: `date`" >> $LOGFILE
echo "Failures: `grep --count "FAIL" $LOGFILE`" >> $LOGFILE
if [ "`grep --count "FAIL" $LOGFILE`" -gt "0" ]
  then echo "" && echo -n "NOTE: " && echo "PLEASE CHECK THE INSTALL.LOG FILE ($LOGFILE); THERE WERE `grep --count "FAIL" $LOGFILE` REPORTED ERRORS."
  else echo "" && echo -n "NOTE: " && echo "Your install appeared to complete without errors, but be sure to check the install.log file just to make sure."
fi
echo "      Please restart your computer for all configuration changes to take effect."

# LEAVE OURSELVES ON THE DESKTOP
cd $HOME/Desktop
