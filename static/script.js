$(document).ready(function () {
    const $code = $('#code');
    const $lineNumbers = $('#line-numbers');
    const $output = $('#output');

    function updateLineNumbers() {
        const lines = $code.val().split("\n").length;
        let lineNumberHTML = Array.from({length: lines + 1}, (_, i) => i).join('<br>');
        $lineNumbers.html(lineNumberHTML);
    }

    function runCode() {
        const code = $code.val();
        $output.text('Running...').removeClass('error');
        $.post('/run', {code: code})
            .done(function (data) {
                $output.html('<pre>' + (typeof data === 'object' ? JSON.stringify(data, null, 2) : data) + '</pre>');
            })
            .fail(function (xhr) {
                $output.html('<pre>Error: ' + xhr.responseText + '</pre>').addClass('error');
            });
    }

    // 更新行号
    $code.on('input', updateLineNumbers);

    // 同步滚动
    $code.on('scroll', function () {
        $lineNumbers.scrollTop($code.scrollTop());
    });

    // 运行按钮点击事件
    $('#run').on('click', runCode);

    // 允许按下Ctrl + Enter来运行代码
    $code.on('keypress', function (e) {
        if (e.which === 13 && e.ctrlKey) {
            runCode();
            e.preventDefault();
        }
    });

    // 初始更新行号
    updateLineNumbers();
});
