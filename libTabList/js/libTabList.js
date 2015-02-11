/********************
pullDown
********************/

;(function($){
	var namespace = 'libTabList';

	console.log('hoge');


	/********************
	methods
	********************/

	var methods = {

		/********************
		initialize
		********************/
		initialize:function(method){
			return this.each(function(){

				// オプションをセット
				$(this).data(namespace, $.extend(true, {
					tabName:'aiueo'
				}, method));

				// dataコピー
				var $this = $(this)
				,options = $this.data(namespace);

				console.log($this.data(namespace));

			});
		}
	};


	/********************
	全プラグイン共通
	********************/
	$.fn[namespace] = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method){
			return methods.initialize.apply(this, arguments);
		}
	}

})(jQuery);