layui.use(['form', 'table', 'element'], function () {
    var table = layui.table
        , element = layui.element
        , form = layui.form;
    element.render();

    table.render({
        elem: '#keyword-table'
        , url: BMY.url.prefix + '/keyword/list'
        , page: true
        , limit: 10
        , height: 'full-330'
        , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        , cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true}
            , {field: 'words', title: '关键字', edit: 'text', sort: true}
            , {title: '状态', width: 90, align: 'center', toolbar: '#enableTpl'}
            , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#keywordTableBar'}
        ]]
    });

    //监听单元格编辑
    table.on('edit(keyword)', function (obj) {
        var value = obj.value;
        var data = obj.data;
        BMY.ajax(BMY.url.prefix + "/keyword/edit/words", obj.data, function (json) {
            if (json.code === BMY.status.ok) {
                layer.msg('修改成功！<br/>' + '[ID: ' + data.id + '] 行字段更改为：' + value)
            } else {
                layer.msg("修改出错，错误信息：" + json.message);
            }
        })
    });

    //监听工具条
    table.on('tool(keyword)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删除么?', function (index) {
                BMY.ajax(BMY.url.prefix + "/keyword/delete", {id: data.id}, function (json) {
                    BMY.okMsgHandle(json, "删除成功");
                    if (json.code === BMY.status.ok) obj.del();
                    layer.close(index);
                })
            });
        }
    });

    $(".layui-btn[data-type=addKeyword]").on("click", function () {
        var index = layer.confirm($("#addKeywordPage").html(), {
            title: '新增关键字'
            , type: 1
            , area: '480px'
        }, function () {
            BMY.ajax(BMY.url.prefix + "/keyword/add", {
                words: $("input.layui-input[name=words]").val()
            }, function (json) {
                BMY.okHandle(json, index, "keyword-table");
            })
        });
    });

    form.on('switch(enable)', function (obj) {
        BMY.ajax(BMY.url.prefix + "/keyword/edit/enable", {id: this.value, enable: obj.elem.checked}, function (json) {
            BMY.okMsgHandle(json);
            layer.tips('状态：' + ((obj.elem.checked) ? "正常" : "隐藏"), obj.othis);
        });
    });


});






