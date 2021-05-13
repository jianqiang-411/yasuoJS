var gulp = require('gulp')
var concat = require('gulp-concat'); //引用
var uglify = require('gulp-uglify')

gulp.task('script', done => {
    // 1\. 找到文件
    gulp.src('src/**/*.js')
        // 将多个js合并一个js里面
        .pipe(concat('lz4.js'))
        // 2\. 压缩文件
        .pipe(uglify())
        // 3\. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
    done()
})