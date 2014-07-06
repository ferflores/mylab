function AjaxRequest(){

	var Configuration = null;
	var _this = this;

	this.request = function(configuration){
		_this.Configuration = configuration;

        if(_this.Configuration.requestCallBack!=null){
            _this.Configuration.requestCallBack();
        }

        $.ajax({
            type: "POST",
            url: _this.Configuration.URL,
            data: _this.Configuration.data,
            async:_this.Configuration.async,
            }).done(function(response) {
                if(_this.Configuration.callBack!=null){
                    _this.Configuration.callBack(response);
                }
            })
            .fail(function(errorResponse) {
                console.log(errorResponse);
                if(_this.Configuration.errorCallBack!=null){
                    _this.Configuration.errorCallBack(response);
                }
            });
    	}
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}