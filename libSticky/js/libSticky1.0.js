/********************
libSticky
********************/

;(function($){
	var namespace = 'libSticky'
	,$window = $(window);



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
					stickyClass : 'elSticky'
					,cloneClass : 'elClone'
					,$clone : null
					,stickyFlag : false
					,offsetTop : 0
				}, method));

				// dataコピー
				var $this = $(this)
				,options = $this.data(namespace);

				options.offsetTop = $this.offset().top;

				methods.eventSet.apply($this);

			});
		}

		/********************
		eventSet
		********************/
		,eventSet:function(){
			var $this = $(this)
			,options = $this.data(namespace)
			,offsetTop = options.offsetTop
			,scrollTopNum = 0;

			$window.on('scroll.' + namespace, function(e){
				scrollTopNum = $window.scrollTop();

				if(scrollTopNum > offsetTop){
					if(!options.stickyFlag){
						options.stickyFlag = true;
						methods.stickyClone.apply($this);
						$this.toggleClass(options.stickyClass,true);
					}
				}
				else{
					if(options.stickyFlag){
						options.stickyFlag = false;
						methods.removeClone.apply($this);
						$this.toggleClass(options.stickyClass,false);
					}
				}
			});
		}

		,stickyClone:function(){
			var $this = $(this)
			,options = $this.data(namespace)
			,$clone = $this.clone(false);

			$clone.toggleClass(options.cloneClass,true).toggleClass(options.stickyClass,false);

			options.$clone = $clone;

			$this.after($clone);
		}

		,removeClone:function(){
			var $this = $(this)
			,options = $this.data(namespace);

			if(options.$clone === null){
				return;
			}

			options.$clone.remove();

			options.$clone = null;
		}

		/********************
		destroy
		********************/
		,destroy:function(){
			var $this = $(this)
			,options = $this.data(namespace);

			$window.off('.' + namespace);

			$this.toggleClass(options.stickyClass,false);

			if(options.$clone !== null){
				options.$clone.remove();
			}

			$this.removeData(namespace);
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