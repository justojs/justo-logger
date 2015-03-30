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
        src: ["build/es5/**"],
        dest: "dist/es5/<%= pkg.name %>/lib/index.js"
      }
    },
    
    copy: {
    	es5: {
    		files: [
    		  {src: ["package.json", "README.md"], dest: "dist/es5/<%= pkg.name %>/", expand: true},
    		  {src: ["test/**/*.*"], dest: "dist/es5/<%= pkg.name %>", expand: true}
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
            "justo-assert",
            "util"
          ],
          timeout: 1500
        },

        src: [
          "test/unit/main.js",
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