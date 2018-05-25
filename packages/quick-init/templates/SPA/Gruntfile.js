/**
 * @PengJiyuan
 */
const path = require('path');
const dllConfig = require('./dll.config.js');
// 将所打icon的unicode编码与antd的icons的编码统一
const iconfontMaps = require('./iconfonts/map.json');
const codepoints = {};
iconfontMaps.icons.forEach(icons => {
  codepoints[icons.name] = parseInt(icons.unicode, 16);
});

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('../package.json'),
    banner: '/*!\n' +
      ' * Garen v<%= pkg.version %>\n' +
      ' * Powered by TFCloud Inc.\n' +
      ' */\n',

    // Task configuration.
    clean: {
      dist: ['client/public/dist/*'],
      assets: ['client/public/assets/*/'],
      iconfonts: ['client/iconfonts/html', 'client/iconfonts/fonts']
    },

    cssnano: {
      options: {
        sourcemap: false
      },
      dist: {
        files: [{
          src: 'client/public/dist/*.css',
          dest: 'client/public/dist/'
        }]
      }
    },

    webpack: {
      options: {
        // 报错后继续运行
        failOnError: false
      },
      buildDll: dllConfig(),
      devDll: dllConfig({development: true})
    },

    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: ['client/public/dist/*']
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'client/applications',
        src: '**/assets/**',
        dest: 'client/public/assets/',
        rename: function(dest, matchedSrcPath) {
          return path.join(dest, matchedSrcPath.replace('/assets', ''));
        }
      }
    }

  });

  grunt.file.setBase('../');

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  require('time-grunt')(grunt);

  grunt.registerTask('beforeDev', ['clean:dist', 'webpack:devDll']);
  grunt.registerTask('beforeBuild', ['clean:dist', 'webpack:buildDll']);
  // Cope with the rest stuffs
  grunt.registerTask('rest', ['cssnano', 'usebanner', 'merge_assets']);

  grunt.registerTask('merge_assets', ['clean:assets', 'copy:assets']);

};
