module.exports = function (grunt) {
    require('grunt-dojo2').initConfig(grunt, {
        copy: {
            devStyles: {
                expand: true,
                cwd: '.',
                src: 'src/styles/dgrid.css',
                dest: '<%= devDirectory %>'
            },
            distStyles: {
                expand: true,
                cwd: 'src',
                src: 'styles/dgrid.css',
                dest: '<%= distDirectory %>'
            },
            examples: {
                expand: true,
                cwd: '.',
                src: 'examples/**/*.{html,css,json,xml,js,txt}',
                dest: '<%= devDirectory %>'
            }
        }
    });

    grunt.registerTask('dev', grunt.config.get('devTasks').concat([
        'postcss:modules-dev',
        'copy:devStyles'
    ]));

    grunt.registerTask('dist', grunt.config.get('distTasks').concat([
        'postcss:modules-dist',
        'postcss:variables',
        'copy:distStyles'
    ]));
};
