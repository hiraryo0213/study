/********************
pullDown
********************/

;(function($){
	var namespace = 'libTabList';



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
					tabListAttr:'role="tablist"'
					,tabAttr:'role="tab"'
					,tabPanelAttr:'role="tabPanel"'
					,selectedTabAttr:'aria-selected'
					,hideTabPanelAttr:'aria-hidden'
					,relationshipAttr:'aria-controles'

					// tabのDOM格納場所
					,$tab:null
					// tabPanelのDOM格納場所
					,$tabPanel:null
					// 上書きを行うことで、最初の選択されている場所を指定できる
					,$selectedTab:false
					// 最初に開いているtabPanel格納場所
					,$shownTabPenel:false
				}, method));

				// dataコピー
				var $this = $(this)
				,options = $this.data(namespace);

				// tabListを選択されていない状態に、tabPanel隠している状態にしてそれぞれを格納
				options.$tab = $this.find('[' + options.tabAttr + ']').attr(options.selectedTabAttr,false);
				options.$tabPanel = $this.find('[' + options.tabPanelAttr + ']').attr(options.hideTabPanelAttr,true);

				var $selectedTab
				,$shownTabPenel
				,relationship;

				// 最初の選択されているtabが指定されているか否か
				if(options.$selectedTab === false){
					// 選択されていない時はtabListのfirst-childとする
					$selectedTab = options.$tab.eq(0);
					// aria-controlesと対応したtabPanel取得
					relationship = $selectedTab.attr(options.relationshipAttr);
					$shownTabPenel = options.$tabPanel.filter('#' + relationship);

					// 属性値を変えて格納
					options.$selectedTab = $selectedTab.attr(options.selectedTabAttr,true);
					options.$shownTabPenel = $shownTabPenel.attr(options.hideTabPanelAttr,false);
				}
				else{
					relationship = options.$selectedTab.attr(options.relationshipAttr);
					$shownTabPenel = options.$tabPanel.filter('#' + relationship);

					options.$selectedTab.attr(options.selectedTabAttr,true);
					options.$shownTabPenel = $shownTabPenel.attr(options.hideTabPanelAttr,false);

				}

				// eventSet実行
				methods.eventSet.apply($this);

			});
		}

		/********************
		eventSet
		********************/
		,eventSet:function(){
			// $(this)はinitializeのapply関数の引数
			var $this = $(this)
			// dataコピー
			,options = $this.data(namespace);

			// tabにイベントセット（delegateで付与）
			$this.on('click.' + namespace, '[' + options.tabAttr + ']',function(e){
				// aタグの挙動をクリア
				e.preventDefault();
				// 押されたタブのDOM取得
				var $target = $(e.target);

				// tabSwitcher実行（引数でtargetも渡すため、array型で渡す）
				methods.tabSwitcher.apply([$this,$target]);
				// tabPanelSwitcher実行（引数でtargetも渡すため、array型で渡す）
				methods.tabPanelSwitcher.apply([$this,$target]);
			});
		}

		/********************
		tabSwitcher
		********************/
		,tabSwitcher:function(){
			// $(this)はeventSetの引数で、$thisにはarrayの0番目を格納
			var $this = $(this)[0]
			// $targetにはarrayの1番目を格納
			,$target = $(this)[1]
			// dataコピー
			,options = $this.data(namespace);
			
			// tab全部を一度selectされていない状態にする
			options.$tab.attr(options.selectedTabAttr,false);
			// クリックされたtabをselectされている状態にする
			$target.attr(options.selectedTabAttr,true);
		}

		/********************
		tabPanelSwitcher
		********************/
		,tabPanelSwitcher:function(){
			// $(this)はeventSetの引数で、$thisにはarrayの0番目を格納
			var $this = $(this)[0]
			// $targetにはarrayの1番目を格納
			,$target = $(this)[1]
			// dataコピー
			,options = $this.data(namespace)
			// tabPanelは複数使うため変数に格納
			,$tabPanel = options.$tabPanel


			// aria-controlsのvalueを取得する
			,relationship = $target.attr(options.relationshipAttr);

			// 一度すべてのtabPanelを隠す
			$tabPanel.attr(options.hideTabPanelAttr,true);
			// aria-controlesの値からtabPanelを探し出し、表示させる
			$tabPanel.filter('#' + relationship).attr(options.hideTabPanelAttr,false);
		}

		/********************
		destroy
		********************/
		,destroy:function(){
			var $this = $(this)
			// dataコピー
			,options = $this.data(namespace)
			,selectedTabAttr = options.selectedTabAttr
			,hideTabPanelAttr = options.hideTabPanelAttr;

			// イベント削除
			$this.off('.' + namespace);

			// aria-*属性をトルツメ
			$this.find('[' + selectedTabAttr + ']').removeAttr(selectedTabAttr);
			$this.find('[' + hideTabPanelAttr + ']').removeAttr(hideTabPanelAttr);
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