module.exports = function (grunt) {
  "use strict";

  //(1) config
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    banner: "",

    babel: {
      options: {
        sourceMap: false,
      },

      es5: {
        files: {
          "build/es5/lib/Level.js": "lib/Level.js",
          "build/es5/lib/LogEntry.js": "lib/LogEntry.js",
          "build/es5/lib/Logger.js": "lib/Logger.js",
          "build/es5/lib/Writer.js": "lib/Writer.js",
          "build/es5/lib/writer/main_nodejs.js": "lib/writer/main_nodejs.js",
          "build/es5/lib/writer/main_browser.js": "lib/writer/main_browser.js",
          "build/es5/lib/writer/ConsoleWriter.js": "lib/writer/ConsoleWriter.js",
          "build/es5/lib/writer/ColoredConsoleWriter.js": "lib/writer/ColoredConsoleWriter.js",
          "build/es5/lib/writer/FileWriter.js": "lib/writer/FileWriter.js",
          "build/es5/lib/writer/RollingFileWriter.js": "lib/writer/RollingFileWriter.js"
        }
      }
    },

    clean: {
      es5: {
        src: ["build/es5", "dist/es5"]
      }
    },

    concat: {
      options: {
        separator: "\n\n"
      },

      nodejs: {
        src: ["build/es5/lib/*.js", "build/es5/lib/writer/main_nodejs.js"],
        dest: "dist/es5/nodejs/<%= pkg.name %>/lib/index.js"
      },
      
      browser: {
      	options: {
      		process: function(src, filepath) {
      			if (/ConsoleWriter.js$/.test(filepath)) {
       				src = src.replace(/\/\/imports\n(var .*;\n)*/, "");
       			}
       			
       			return src;
      		}
      	},
      	
      	src: ["build/es/lib/*.js", "build/es5/lib/writer/main_browser.js", "build/es5/lib/writer/ConsoleWriter.js"],
      	dest: "dist/es5/browser/<%= pkg.name %>/lib/index.js"
      }
    },
    
    copy: {
    	nodejs: {
    		files: [
    		  {src: ["package.json", "README.md"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true},
    		  {src: ["test/**/*.*"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true},
    		  {cwd: "build/es5/lib/writer/", src: ["*.*", "!main_*.js"], dest: "dist/es5/nodejs/<%= pkg.name %>/lib/writer", expand: true}
    		]
    	}
    },

    jshint: {
      gruntfile: {
        src: ["Gruntfile.js"]
      },

      lib: {
        options: {
          jshintrc: true
        },

        src: ["lib/**"]
      },

      test: {
        options: {
        	jshintrc: true,
        	
          ignores: [
            "test/**/mocha.opts"
          ]
        },

        src: ["test/unit/**"]
      }
    },

    mochaTest:{
      nodejs: {
        options: {
          ignoreLeaks: false,
          quiet: false,
          reporter: "spec",
          require: [
            "assert",
            "sinon",
            "justo-assert"
          ],
          timeout: 3000
        },

        src: [
          "test/unit/init.js",
          "test/unit/**/*.js",
        ]
      }
    }
  });

  //(2) load plugins
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-test");
  
  //(3) definne tasks and alias
  grunt.registerTask("buildes5", [
    "jshint",
    "clean:es5",
    "babel:es5",
    "concat:nodejs",
    "concat:browser",
    "copy:nodejs"
  ]);
  
  grunt.registerTask("es5", ["buildes5", "mochaTest:nodejs"]);

  //(4) define default task
  grunt.registerTask("default", []);
};