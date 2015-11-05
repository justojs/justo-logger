module.exports = function (grunt) {
  "use strict";

  //(1) config
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    babel: {
      options: {
        sourceMap: false,
        comments: false
      },

      es5: {
        files: {
          "build/es5/lib/index.js": "lib/index.js",
          "build/es5/lib/Level.js": "lib/Level.js",
          "build/es5/lib/LogEntry.js": "lib/LogEntry.js",
          "build/es5/lib/Logger.js": "lib/Logger.js",
          "build/es5/lib/Loggers.js": "lib/Loggers.js",
          "build/es5/lib/logger/ColoredConsoleLogger.js": "lib/logger/ColoredConsoleLogger.js",
          "build/es5/lib/logger/ConsoleLogger.js": "lib/logger/ConsoleLogger.js",
          "build/es5/lib/logger/util.js": "lib/logger/util.js"
        }
      }
    },

    clean: {
      es5: {
        src: ["build/es5", "dist/es5"]
      }
    },

    copy: {
      nodejs: {
        files: [
          {cwd: "build/es5/", src: ["lib/*.js", "lib/logger/*.js"], dest: "dist/es5/nodejs/<%= pkg.name %>", expand: true},
          {src: ["package.json", "README.md"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true},
          {src: ["test/**/*.*"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true}
        ]
      }
    },

    jshint: {
      gruntfile: {
        src: ["Gruntfile.js"]
      },

      lib: {
        options: {
          jshintrc: true,
          ignores: [
            "lib/index.js"
          ]
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

    mochaTest: {
      es5: {
        options: {
          ignoreLeaks: false,
          quiet: false,
          reporter: "spec",
          require: [
            "assert",
            "justo-assert"
          ],
          timeout: 3000
        },

        src: [
          "test/unit/init.js",
          "test/unit/**/*.js",
          "!test/unit/lib/writer/*.js"
        ]
      }
    },
  });

  //(2) load plugins
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-travis-lint");

  //(3) definne tasks and alias
  grunt.registerTask("buildes5", ["travis-lint", "jshint", "clean:es5", "babel:es5", "copy:nodejs"]);
  grunt.registerTask("test", ["mochaTest:es5"]);
  grunt.registerTask("es5", ["buildes5", "test"]);

  //(4) define default task
  grunt.registerTask("default", []);
};
