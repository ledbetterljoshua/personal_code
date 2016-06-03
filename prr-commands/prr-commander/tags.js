//dependencies
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var pd = require('pretty-data').pd;
//files to edit
var tagsProp = "./prr-templates/tags.properties";
var prrTemplates = "./prr-templates";
var tagConfig = "./config/reviewTagConfiguration.xml";
var configFile = "./config";
var exports = module.exports = {};
//files to pull from 
var reviewTagConfiguration = __dirname + '/files/reviewTagConfiguration.xml';

exports.createTagProp = function(key, text, externalID, group, category) {
    //dummy data
    var displayCode = "1001",parentDisplayCode = "0000",key = "SymptomsAwesomeLedbetter",text = "Joshua rocks at code man",externalID = "PrescriptionLEDBET",group = "OtherSources", category = "Con";
    //tag file specific variables
    //used for the selection of elements
    var dimensionExternal = "property[name=\"dimensionExternalIDToTagListMap\"]",
        dimensionExternalKey = dimensionExternal + ' map entry[key='+key+']',
        dimensionExternalPID = dimensionExternal + ' map entry[key='+key+'] bean[p:externalID="'+externalID+'"]',
        beanTagConfiguration = "bean[class=\"com.bazaarvoice.cca.config.TagConfiguration\"]",
        dimensionListName = "property[name=\"dimensionListNameToDimensionExternalIDListMap\"]",
        dimensionListNameCategory = dimensionListName+' map entry[key='+category+']',
        bean = '<bean p:externalID="'+externalID+'" class="com.bazaarvoice.cca.config.TagDefinition"/>',
        tagListName = "property[name=\"tagListNameToDimensionAndTagExternalIDListMap\"]",
        tagListNameCategory = tagListName+' map entry[key='+category+']';

    var fillEmptyFile = function(data) {
        $ = cheerio.load(data, {xmlMode: true});
        //pass the data from reviewTagConfiguration to the clients newly created config file
        //update the display code and parent display code
        $(beanTagConfiguration).attr('name', displayCode).attr('parent', parentDisplayCode);
        // function used to update the config.xml file after it has been called
        var callMeAttr = function(location, attr, value, find, text){
            if (!find && attr)  $(location).attr(attr, value);
            else if (find && attr) $(location).find(find).attr(attr, value);
            else if (find && text && !attr) $(location).find(find).text(text); }
        //update attributes to create a tag
        callMeAttr(dimensionExternal + ' map entry', 'key',  key);
        callMeAttr('entry[key='+key+'] list bean', 'p\:externalID',  externalID);
        callMeAttr(dimensionListName+' map entry', 'key',  category);
        callMeAttr(dimensionListName+' map', false, false, 'entry[key='+category+'] list value', group);
        callMeAttr(tagListName+' map entry', 'key',  category);
        callMeAttr(tagListName+' map', false, false, 'entry[key='+category+'] list value', group + "/" + externalID);
        //check is the client has a config folder
    }
    //check if config folder and prr-templates folder exists
        //if not, create them synchronously. 
        //Do not go to next commend until config folders are created
    if (!fs.existsSync(configFile)){
        console.log('config folder does not exist, creating it.');
        fs.mkdirSync(configFile);
    }
    if (!fs.existsSync(prrTemplates)){
        console.log('prr-templates folder does not exist, creating it.');
        fs.mkdirSync(prrTemplates);
    }
    //check done

    //tags.properties file - BEGI
    fs.exists(tagsProp, function(exists) {
        if(!exists) {
            var Cdata = category+'/'+externalID+'='+text;
            console.log('CData: ' + Cdata);
            //create the file
            fs.writeFile(tagsProp, Cdata, 'utf8', 
                function(err) {
                    console.log('tags properties file not found. Created.');
            });
        } else {
            var _tagsPropFile = fs.readFile(tagsProp,'utf-8', 
            function(err, data){
                if (err) throw err;

                //KEEP PROPERTIES FILE ORGANIZED
                    //tested on 2000 line properties file
                //push each line of file into array, split by \n
                var fileContents = data.split('\n');

                //search the array and find a line that begins with the category
                function searchStringInArray (str, strArray) {
                    for (var j=0; j<strArray.length; j++) {
                        if (strArray[j].match(str)) return j;
                    }
                    return -1;
                }
                var _index = searchStringInArray(category+'/', fileContents);
                //push Cdata to the array after the found category
                var Cdata = category+'/'+externalID+'='+text;
                fileContents.splice(_index, 0, Cdata);

                //turn array into string
                var fileContents = fileContents.toString();

                //find all commas from array and turn them into line breaks
                var replaceAll = function(search, replacement) {
                    var target = fileContents;
                    return target.split(search).join(replacement);
                };

                var fileContentsFinale = replaceAll(',', '\n');

                //add fileContentsFinale to the file
                fs.writeFile(tagsProp, fileContentsFinale, 'utf8', 
                    function(err) {
                        console.log('tag properties file found. Tag added.');
                });
            });
        }
    });
    //tags.properties file - END

    fs.exists(tagConfig, function(exists) {
    //if reviewTagConfiguration file does not exists
       if (!exists) {
        //read reviewTagConfiguration
        var _tagConfigFile = fs.readFile(reviewTagConfiguration,'utf-8', 
            function(err, data){
        
                if (err) throw err;

                fillEmptyFile(data);

                //create the file
                fs.writeFile(tagConfig, $.html(), 'utf8', 
                    function(err) {
                        console.log('filelistAsync complete');
                });
            });
       } else {
            //the tag config file exists, 
            //start updating and adding values
            var _tagConfigFile = fs.readFile(tagConfig,'utf-8', function(err, data){
                if (err) throw err;
                if(data == '' || !data) {
                    fs.readFile(reviewTagConfiguration,'utf-8', 
                    function(err, data){
                        if (err) throw err;
                        fillEmptyFile(data);
                        //create the file
                        fs.writeFile(tagConfig, $.html(), 'utf8', 
                            function(err) {
                                console.log('file found, but empty, filelistAsync complete');
                        });
                    });
                } else {
                    $ = cheerio.load(data, {xmlMode: true});

                    var iff = function(ifOne, cb, cbTwo ) {
                        var _self = ifOne;
                        if(ifOne) cb(_self); 
                        else cbTwo(_self); }

                    // ********** SECTON - dimensionExternalKey - END ********** //    
                    //if entry does not exist, check if it is blank
                    iff(!$(dimensionExternalKey).length, function(_self) {
                        if($(dimensionExternal+ ' entry').attr('key') == "") {
                            //if it is blank, fill it
                            $(dimensionExternal+ ' entry').attr('key', key);
                            if ($(dimensionExternalKey+' list bean').attr("p:externalID") == "") { $(dimensionExternalKey+' list bean').attr("p:externalID", externalID); }
                        } else {
                            //else add it with the list and bean
                            $(dimensionExternal+' map').append('<entry key="'+key+'"><list>'+bean+'</list></entry>');
                        }

                    }, function(){
                        //if it does exist, check to see if the externalID exists within it
                        //if it does, do nothing
                        var myDivs = $(dimensionExternalKey+ ' list').children('bean[p\\:externalID="'+externalID+'"]');
                        if(myDivs.length === 0){$(dimensionExternalKey+ ' list').append(bean)}
                        //console.log($(dimensionExternalKey+ ' list bean'));
                    });
                    // ********** SECTON - dimensionExternalKey - END ********** //

                    var doNotRepeat = function(first, second, tag) {
                        //if entry does not exist, check if it is blank
                        iff(!$(first).length, function(_self) {
                            if($(second+ ' map entry').attr('key') == "") {
                                //if it is blank, fill it
                                $(second+ ' map entry').attr('key', category);
                                if ($(first+' list').find('value').text() == "") { 
                                    if(tag) {$(first+' list').find('value').text(group + '/' + externalID); }
                                    else {$(first+' list').find('value').text(group); }
                                }
                            } else {
                                //else add it with the list and bean
                                if(tag) {$(second+' map').append('<entry key="'+category+'"><list><value>'+group + '/' + externalID+'</value></list></entry>');}
                                else {$(second+' map').append('<entry key="'+category+'"><list><value>'+group+'</value></list></entry>');}
                            }
                        }, function(){
                            //if it does exist, check to see if the externalID exists within it
                            //if it does, do nothing
                            var aTags = $(first+' list value');
                            var found;
                            for (i in aTags) {
                              try {
                                if(tag && aTags[i].children[0].data == group + '/' + externalID) {var found = aTags[i];break;}
                                else {if (aTags[i].children[0].data == group) {var found = aTags[i];break;} }
                              } catch (err){
                               // console.log(err)
                              }
                              //console.log(aTags[i])
                            }
                            if(!found) { 
                                //console.log("coudnt find it...")
                                if(tag){$(first+' list').append('<value>'+group + '/' + externalID+'</value>');} 
                                else {$(first+' list').append('<value>'+group+'</value>');}
                            }
                        });
                    }

                    doNotRepeat(dimensionListNameCategory, dimensionListName);
                    doNotRepeat(tagListNameCategory, tagListName, true);

                    var xml_pp = pd.xml($.html());
                    //overwrite the file with edited version
                    fs.writeFile(tagConfig, xml_pp, 'utf8', 
                        function(err) {
                            console.log('tag configuration file exists \nupdating now and making it pretty... \n\n Please make sure to update the categoryKeyToDimensionAndTagListNameMap section. This has not been updated.');
                    });
                }
           });
        }
    });

};
exports.createTagProp();
