/**
 * Created by 919482722 on 2018/2/6.
 */

$(function () {
    var Authorization =  $.cookie("Authorization");
    // var Authorization = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5NTgyNTgyMDgyMTA4MDg4MzIiLCJleHAiOjE1MTg2MDQ0NzN9.xbg-ePqBk7PFXgQOn0A0aju_weBLeU-ZZJtHO3qRHzr44CxbizpRCEFAvvUjPwBCVRmGEfav0tzBfmnBxlbA3Q';
    console.log(Authorization,'token');
    var cityId = $.cookie('cityId');
    // var cityId = 182272;

    // 目标城市
    $('.selectedP').text($.cookie('province'));
    $('.selectedC').text($.cookie('city'));
    // 获取古玩城
    getAntique();
    // 获取古玩城
    function getAntique() {
        console.log(cityId,"cityId");
        $.ajax({
            url:"http://120.27.226.156:8080/roo-mobile-web/curiocity/city/"+cityId,
            type:"GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            // beforeSend: function (request) {
            //     request.setRequestHeader("Authorization", Authorization);
            // },
            headers: {
                'Authorization': Authorization
            },
            success:function(info){
                //取到所有古玩城并将其导入到select中
                console.log(info,"古玩城");
                // var curioId = $('#curio').find("option:selected").val();
                var curioId = info.data[0].id;
                // console.log(curioId,'古玩城Id');
                $.each(info.data,function(index,value){
                    $("#curio").append("<option value=" + value.id + ">" + value.curiocityName + "</option>");
                });
                requestShopData(curioId);
                // 古玩城更改时获取相应店铺数据
                $("#curio").change(function () {
                    curioId = $(this).find("option:selected").val();
                    // console.log(curioId,'古玩城id222');
                    // $("#shopList").remove();
                    requestShopData(curioId);
                });

            }
        })
    };

    // 获取古玩城下店铺列表
    function requestShopData(curiocityId){
        var curiocityId = curiocityId;
        var data="curiocityId="+curiocityId;
        $.ajax({
            url: "http://120.27.226.156:8080/roo-mobile-web/partner/shop/page?"+data,
            type: "GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            headers: {
                'Authorization': Authorization,
                'cityId': cityId
            },
            error: function (jqXHR,textStatus,errorThrown) {
                console.log(jqXHR,'返回jqXHR');
                console.log(textStatus,'返回的状态textStatus');
                console.log(errorThrown,'返回服务器的错误信息errorThrown');
            },
            success:function(info){
                console.log(info,"古玩城下店铺");
                // 调用模板引擎处理店铺列表
                var shopsHtml = template("myShopList",info);
                $("#shopList").html(shopsHtml);

                $.each(info.data,function(index,value){
                    if(value.recommoned == 0){
                        $('#shopList').on('click','.recommend',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://120.27.226.156:8080/roo-mobile-web/partner/shop/"+id+"/recommoned",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"推荐店铺");
                                    window.location.reload();
                                }
                            })
                        })
                    };
                    if(value.recommoned == 1){
                        $('.recommend').text('取消推荐').css('color','#999');
                        $('#shopList').on('click','.recommend',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://120.27.226.156:8080/roo-mobile-web/partner/shop/"+id+"/unrecommoned",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"取消推荐");
                                    window.location.reload();
                                }
                            })
                        })
                    };
                    if(value.shopState == 0){
                        // c89355
                        $('.closed').text('开启店铺').css('color','#666');
                        $('#shopList').on('click','.closed',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://120.27.226.156:8080/roo-mobile-web/partner/shop/"+id+"/open",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"开启店铺");
                                    window.location.reload();
                                }
                            })
                        });
                    };
                    if(value.shopState == 1){
                        $('#shopList').on('click','.closed',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://120.27.226.156:8080/roo-mobile-web/partner/shop/"+id+"/unopen",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"关闭店铺");
                                    window.location.reload();
                                }
                            })
                        });
                    }
                });
            }
        })
    }

    $('#shopList').on('click','.details',function () {
        var id = $(this).attr('data-id');
        console.log(id,"店铺id");
        $.ajax({
            url:"http://120.27.226.156:8080/roo-mobile-web/partner/shop/"+id,
            type:"GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            headers: {
                'Authorization': Authorization,
                'cityId': cityId
            },
            success:function(info){
                console.log(info,"店铺详情");
                $('#shops').css('display','none');
                $('#shopDetail').css('display','block');
                // 调用模板引擎处理店铺详情
                var shopsDetailHtml = template("myShopDetail",info.data);
                $(".content").html(shopsDetailHtml);
            }
        })
    })
})