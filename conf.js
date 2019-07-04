var jasmineReporters = require('jasmine-reporters');
var htmlReporter = require('protractor-html-reporter-2');
var fs = require('fs-extra');

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	suites: {
		smoke: './src/com/jetBlue/e2e/specs/p3/*.js',
	},		
	framework : "jasmine2",
	capabilities : {
		browserName : 'chrome'
	},
	onPrepare : function() {
		// Default window size
		browser.manage().window().maximize();
		// Default implicit wait
		browser.manage().timeouts().implicitlyWait(10000);
		// // Angular sync for non angular apps
		browser.ignoreSynchronization = true;
		fs.emptyDir('./reports/xml/', function (err) {
			//console.log(err);
		});

		jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			savePath: './reports/xml/',
			filePrefix: 'xmlresults'
		}));
	},
	onComplete : function() {

		var browserName, browserVersion;
     	var capsPromise = browser.getCapabilities();
 
		browser.getCapabilities().then(function (cap) {
			fs.emptyDir('./reports/' + cap.get('browserName') + '/screenshots', function (err) {
			//console.log(err);
			});
		});
     	capsPromise.then(function (caps) {
        	browserName = caps.get('browserName');
        	browserVersion = caps.get('version');
        	platform = caps.get('platform');
 
	        testConfig = {
    	        reportTitle: 'Protractor Test Execution Report',
        	    outputPath: './reports',
	            outputFilename: 'ProtractorTestReport',
            	screenshotPath: '.reports/chrome/screenshots',
            	testBrowser: 'Chrome',
            	browserVersion: 'v.',
            	modifiedSuiteName: false,
            	screenshotsOnlyOnFailure: true,
				testPlatform: 'Windows 7 Professional 64-bit',
				testOwner: 'TestingXperts'				
        	};
        	new htmlReporter().from('./reports/xml/xmlresults.xml', testConfig);
    	});
	}
};