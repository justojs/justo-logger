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
          "build/es5/lib/writer/main.js": "lib/writer/main.js",
          "build/es5/lib/writer/ConsoleWriter.js": "lib/writer/ConsoleWriter.js",
          "build/es5/lib/writer/ColoredConsoleWriter.js": "lib/writer/ColoredConsoleWriter.js",
          "build/es5/lib/writer/FileWriter.js": "lib/writer/FileWriter.js"
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

      es5: {
        src: ["build/es5/lib/*.js", "build/es5/lib/writer/main.js"],
        dest: "dist/es5/<%= pkg.name %>/lib/index.js"
      }
    },
    
    copy: {
    	es5: {
    		files: [
    		  {src: ["package.json", "README.md"], dest: "dist/es5/<%= pkg.name %>/", expand: true},
    		  {src: ["test/**/*.*"], dest: "dist/es5/<%= pkg.name %>/", expand: true},
    		  {cwd: "build/es5/lib/writer/", src: ["*.*", "!main.js"], dest: "dist/es5/<%= pkg.name %>/lib/writer", expand: true}
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
          ignores: [
            "test/**/mocha.opts"
          ]
        },

        src: ["test/unit/**"]
      }
    },

    mochaTest:{
      es5: {
        options: {
          ignoreLeaks: false,
          quiet: false,
          reporter: "spec",
          require: [
            "assert",
            "sinon",
            "justo-assert"
          ],
          timeout: 1500
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
  grunt.registerTask("buildes5", ["clean:es5", "babel:es5", "concat:es5", "copy:es5"]);
  grunt.registerTask("es5", ["buildes5", "mochaTest:es5"]);

  //(4) define default task
  grunt.registerTask("default", []);
};