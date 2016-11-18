<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <title>交通查詢平台</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" charset="UTF-8" />
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="shortcut icon" href="/img/favicon.html">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="/stylesheets/css/index.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/css/simple.datagrid.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/css/jquery.switchButton.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/css/jquery-ui-smoothness.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script  src="/javascripts/jquery-ui-1.12.0.js" aync></script>
    <script  src="/javascripts/simple.datagrid.js" aync></script>
    <script  src="/javascripts/jquery.switchButton.js" aync></script>
    <script  src="/js/bootstrap.min.js"></script>
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="/js/dimple.v2.2.0.min.js"></script>
    <script src="http://dygraphs.com/1.1.1/dygraph-combined-dev.js"></script>
</head>

<body >
<div id="tabs" class="container">
    <ul>
        <li><a href="#tabs-1">路況資訊</a></li>
        <li><a href="#tabs-2" >涵蓋率資訊</a></li>
        <li><a href="#tabs-3" class="hidden">Aenean lacinia</a></li>
    </ul>
    <div id="tabs-1" class="container">
        <div id="hor-container" class="container a-table " >
            <div id="row-top" class="a-table-row ">
                <div class="inner-wrap a-table-cell ">
                    <div id="main-container" class="container a-table ">
                        <div class="inner-wrap a-table-row ">
                            <div id="col-left" class="cells a-table-cell ">
                                <div id="form-wrap">
                                    <div id="marker-list" class="hidden">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=A|ffad00|444444">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=B|5796cf|444444">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=C|58ac45|FFFFFF">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|0099ff|444444">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=E|ff66cc|444444">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=F|d94e59|444444">
                                        <img src="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=G|8278c1|444444">
                                    </div>
                                    <fieldset id="time-field">
                                        <legend> 顯示時段 </legend>
                                        <label for="radio-1">即時</label>
                                        <input type="radio" name="rdo-time" id="radio-1" value="instant">
                                        <label for="radio-2">預測15分</label>
                                        <input type="radio" name="rdo-time" id="radio-2" value="15min">
                                        <label for="radio-3">歷史查詢</label>
                                        <input type="radio" name="rdo-time" id="radio-3" value="history">
                                        <label for="radio-4">預測30分</label>
                                        <input type="radio" name="rdo-time" id="radio-4" value="30min">
                                        <div id="datetime-table" class="table-row hidden">
                                            <div class="table-column table-col-left">
                                                <label id="lbl-datetime-caption"></label>
                                            </div>
                                            <div class="table-column table-col-right">
                                                <label id="lbl-time-left"></label>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset id="display-fileld" class="hidden">
                                        <legend> 地圖顯示 </legend>
                                        <div class="table-wrap">
                                            <div class="table-row">
                                                <div class="table-column table-col-left">資料類別</div>
                                                <div class="table-column table-col-right">
                                                    <select name="資料類別" id="data-category">
                                                        <option value="all">全部</option>
                                                        <option value="vd">VD</option>
                                                        <option value="gvp-official" selected="selected">GVP-公部門</option>
                                                        <option value="gvp-private">GVP-私人車隊</option>
                                                        <option value="gvp-assigned">指定GVP車隊</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="table-row hidden">
                                                <div class="table-column table-col-left">便利資訊</div>
                                                <div class="table-column table-col-right">
                                                    <select name="便利資訊" id="info-selector">
                                                        <option value="all">全部</option>
                                                        <option value="maintainence">保修廠</option>
                                                        <option value="gas-station" selected="selected">加油站</option>
                                                        <option value="toilet">公廁</option>
                                                        <option value="transportation">大眾運輸</option>
                                                        <option value="car-wash">洗車據點</option>
                                                        <option value="hospital">醫院</option>
                                                        <option value="police">警察局</option>
                                                        <option value="others">其他景點</option>
                                                        <option value="none">不顯示</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset id="event-field" class="hidden">
                                        <legend> 事件顯示 </legend>
                                        <div class="table-wrap">
                                            <div class="table-row">
                                                <div class="table-column table-col-left">事件類別</div>
                                                <div class="table-column table-col-right">
                                                    <select name="事件類別" id="event-category">
                                                        <option value="all">全部</option>
                                                        <option value="official" selected="selected">公部門</option>
                                                        <option value="conversion">速率轉事件</option>
                                                        <option value="by-passers">用路人回報</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset id="parking-field" class="hidden">
                                        <legend> 停車資訊 </legend>
                                        <div class="table-wrap">
                                            <div class="table-row">
                                                <div class="table-column table-col-left">價格篩選</div>
                                                <div class="table-column table-col-right">
                                                    <select name="價格篩選" id="parking-hourly">
                                                        <option value="all" selected="selected">全部</option>
                                                        <option value="30">每小時$30元以下</option>
                                                        <option value="60">每小時$30~$60元</option>
                                                        <option value="90">每小時$60~$90元</option>
                                                        <option value="above">每小時$90元以上</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="table-row">
                                                <div class="table-column table-col-left">業者篩選</div>
                                                <div class="table-column table-col-right">
                                                    <select name="業者篩選" id="parking-type">
                                                        <option value="all" selected="selected">全部</option>
                                                        <option value="1">公營</option>
                                                        <option value="2">嘟嘟房</option>
                                                        <option value="3">台灣聯通</option>
                                                        <option value="4">便利</option>
                                                        <option value="5">福慧網</option>
                                                        <option value="6">times</option>
                                                        <option value="99">其他</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset id="convenient-field">
                                        <legend> 便利資訊 </legend>
                                        <div id="switchwrap">
                                            <input type="checkbox" class="switch-button-button" id="flipswitch" style="width: 50px; height: 40px; left: 49px;">
                                        </div>
                                        <label for="rdo-conv-1">全部</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-1" value="all">
                                        <label for="rdo-conv-2">加油站</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-2" value="oil">
                                        <label for="rdo-conv-3">休息站</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-3" value="rest">
                                        <label for="rdo-conv-4">公廁</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-4" value="toilet">
                                        <label for="rdo-conv-5">保修廠</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-5" value="carFactory">
                                        <label for="rdo-conv-6">醫院</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-6" value="hospital">
                                        <label for="rdo-conv-7">警察局</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-7" value="police">
                                        <label for="rdo-conv-8">洗車據點</label>
                                        <input type="checkbox" name="rdo-conv" id="rdo-conv-8" value="carWasher">
                                    </fieldset>
                                    <div class="left-col-but-wrap">
                                        <div id="but-wrap">
                                            <input id="road-submit-button" class="ui-button ui-widget ui-corner-all" type="submit" value="查詢">
                                        </div>
                                        <fieldset id="coverage-field">
                                            <legend> 涵蓋率顯示 </legend>
                                            <div class="table-wrap">
                                                <div class="table-row">
                                                    <div class="table-column table-col-left">資訊類別</div>
                                                    <div class="table-column table-col-right">
                                                        <select name="資訊類別" id="info-category">
                                                            <option value="county">縣市</option>
                                                            <option value="roads" selected="selected">道路別</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div id="col-right" class="cells a-table-cell">
                                <div id="map-panel" class="hidden">&nbsp;</div>
                                <div id="right-panel">
                                    <div id="traffic-button" class="panel-buttons" data-btn-type="traffic"></div>
                                    <div id="event-button" class="panel-buttons" data-btn-type="event"></div>
                                    <div id="parking-button" class="panel-buttons" data-btn-type="parking"></div>
                                    <div id="but-wrap">
                                        <input id="road-submit-button2" class="ui-button ui-widget ui-corner-all" type="submit" value="查詢">
                                    </div>
                                    <div id="vd-button" class="panel-buttons hidden" data-btn-type="vd"></div>
                                </div>
                                <div class="wrapper">
                                    <div id="modal-wrap" class="hidden ">
                                        <div class="modal-app-msg">
                                            <div class="modal-dialog app-msg ">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <button id="modal-btn-close" type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></button>
                                                        <h4 class="modal-title">{0}</h4>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="exinfo text-right">
                                                            費率：一小時 <span class="num">60</span> 元
                                                        </div>
                                                        <div class="exdetail">
                                                            <p>地址：<span>台北市民生東路四段122號</span></p>
                                                            <p>營業時間：<span>7:00～24:00</span></p>
                                                            <p>即時車位數/總車位數：<span>250 </span></p>
                                                            <p>停車場種類：<span>平面/機械 </span></p>
                                                            <p>限高：<span>190公尺 </span></p>
                                                            <p>無障礙服務：<span>有</span></p>
                                                        </div>
                                                    </div>
                                                    <!--  modal body end -->
                                                    <!-- 按鈕 -->
                                                    <div class="modal-footer">
                                                        <a id="modal-dismiss" href="javascript:void(0)" class="btn lightblue" data-dismiss="modal">知道了</a>
                                                        <a id="modal-goto" href="#" class="btn lightblue">前往此處</a>
                                                    </div>
                                                    <div id="modal-pointer" class="">
                                                        <div class="pointer-left-outer">
                                                            <div class="pointer-left-inner"></div>
                                                        </div>
                                                        <div class="pointer-right-outer">
                                                            <div class="pointer-right-inner"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- /.modal-content -->
                                            </div>
                                            <!-- /.modal-dialog -->
                                        </div>
                                    </div>
                                </div>
                                <input id="pac-input" class="controls" type="text" placeholder="Search Box">
                                <div id="map_canvas" class="spanning a-table">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="row-bot" class="a-table-row">
                <div class="inner-wrap a-table-cell">
                    <div id="grid-wrap">
                        <table id="demo-table" data-url="/json/grid.json" class="hidden">
                            <thead>
                            <tr>
                                <th data-key="基隆市">基隆市</th>
                                <th data-key="台北市">台北市</th>
                                <th data-key="桃園市">桃園市</th>
                                <th data-key="新竹市">新竹市</th>
                                <th data-key="新竹縣">新竹縣</th>
                                <th data-key="苗栗縣">苗栗縣</th>
                                <th data-key="台中市">台中市</th>
                                <th data-key="南投縣">南投縣</th>
                                <th data-key="彰化縣">彰化縣</th>
                                <th data-key="雲林縣">雲林縣</th>
                                <th data-key="嘉義市">嘉義市</th>
                                <th data-key="嘉義縣">嘉義縣</th>
                            </tr>
                            </thead>
                        </table>
                        <table id="coverage-table" class="simple-data-grid"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="tabs-2" class="container">
        <div id="hor-container2" class="container a-table">
            <div id="row-top2" class="a-table-row">
                <div class="inner-wrap a-table-cell">
                    <div id="main-container2" class="container a-table">
                        <div class="inner-wrap a-table-row">
                            <div id="col-left2" class="cells a-table-cell">
                                <div id="form-wrap">
                                    <fieldset id="dialog-fileld">
                                        <div id="form-dialog2" title="請選擇">
                                            <form>
                                                <div id="calender-wrap2" >
                                                    <div id="calendar2"></div>
                                                </div>

                                                <div class="label-wrap">
                                                    <label id="lbl-datetime-caption-dialog2" class="left-l">日期時間: </label>
                                                    <label id="lbl-datetime2" class="right-l"></label>
                                                </div>
                                            </form>
                                        </div>
                                    </fieldset>
                                    <fieldset id="display-fileld" >
                                        <legend> 選擇縣市 </legend>
                                        <div class="table-wrap">
                                            <div class="table-row">
                                                <div class="table-column table-col-left">資料類別</div>
                                                <div class="table-column table-col-right">
                                                    <select name="縣市地區" id="data-area">
                                                        <option value="臺北市">臺北市</option>
                                                        <option value="基隆市">基隆市</option>
                                                        <option value="桃園市">桃園市</option>
                                                        <option value="新竹市">新竹市</option>
                                                        <option value="新竹縣">新竹縣</option>
                                                        <option value="苗栗縣">苗栗縣</option>
                                                        <option value="台中市">台中市</option>
                                                        <option value="南投縣">南投縣</option>
                                                        <option value="彰化縣">彰化縣</option>
                                                        <option value="雲林縣">雲林縣</option>
                                                        <option value="嘉義市">嘉義市</option>
                                                        <option value="嘉義縣">嘉義縣</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset id="coverage-field">
                                        <legend> 顯示方式 </legend>
                                        <div class="table-wrap">
                                            <div class="table-row">
                                                <div class="table-column table-col-left">顯示週期</div>
                                                <div class="table-column table-col-right">
                                                    <select name="顯示週期" id="data-scale">
                                                        <option value="0">一天</option>
                                                        <option value="1" >一週</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div class="left-col-but-wrap">
                                        <div id="but-wrap2">
                                            <input id="coverage-submit-button" class="ui-button ui-widget ui-corner-all" type="submit" value="產生圖表">
                                            <label id="lbl-datasource" class="right-l hidden">test</label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div id="col-right3" class="cells a-table-cell">

                                <fieldset id="corerrage" >
                                    <legend> 涵蓋率顯示 </legend>
                                    <div id="div_g2"></div>
                                    <table id="coveragetable-table" class="scroll simple-data-grid hidden"align="center" valign="center">
                                        <thead><tr>
                                        </tr></thead>
                                        <tbody><tr></tr></tbody>
                                    </table>
                                </fieldset>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="row-bot" class="a-table-row">
                <div class="inner-wrap a-table-cell">
                    <div id="grid-wrap">
                        <table id="demo-table" data-url="/json/grid.json" class="hidden">
                            <thead>
                            <tr>
                                <th data-key="基隆市">基隆市</th>
                                <th data-key="台北市">台北市</th>
                                <th data-key="桃園市">桃園市</th>
                                <th data-key="新竹市">新竹市</th>
                                <th data-key="新竹縣">新竹縣</th>
                                <th data-key="苗栗縣">苗栗縣</th>
                                <th data-key="台中市">台中市</th>
                                <th data-key="南投縣">南投縣</th>
                                <th data-key="彰化縣">彰化縣</th>
                                <th data-key="雲林縣">雲林縣</th>
                                <th data-key="嘉義市">嘉義市</th>
                                <th data-key="嘉義縣">嘉義縣</th>
                            </tr>
                            </thead>
                        </table>
                        <table id="coverage-table" class="simple-data-grid"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="confirm-dialog" title="確認">
    <p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
</div>
<div id="form-dialog" title="請選擇">
    <form>
        <div id="calender-wrap" class="hidden">
            <div id="calendar"></div>
        </div>
        <div class="table-wrap">
            <div class="table-row">
                <div class="table-column table-col-left">
                    <input id="hour-spinner" class="spinner" name="時">
                </div>
                <div class="table-column table-col-right">
                    時
                </div>
                <div class="table-column table-col-left">
                    <input id="minute-spinner" class="spinner" name="分">
                </div>
                <div class="table-column table-col-right">
                    分
                </div>
            </div>
        </div>
        <div class="label-wrap">
            <label id="lbl-datetime-caption-dialog" class="left-l">日期時間: </label>
            <label id="lbl-datetime" class="right-l"></label>
        </div>
    </form>
</div>
<script src="/javascripts/initAutoComplete.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDjgcE_4RkfWJPYkZ8feGhe0MxkTNSyItY&libraries=places&callback=initAutocomplete"></script>
<script src="/javascripts/MarkerLabel.js" aync></script>
<script src="/javascripts/index.js"></script>
</body>

</html>
