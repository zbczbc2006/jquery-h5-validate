/*!
 * jquery h5 validate Plugin v1.0.0
 *
 * Copyright (c) 2016 ZhuBincing
 */
;
(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "jquery" ], factory);
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory(require("jquery"));
	} else {
		factory(jQuery);
	}
}(function($) {
	var errorMsg;
	var rule = {
		required : function() {
			if (!this.hasAttribute("required")) {
				return true;
			}
			var $this = $(this)
			if (this.type === 'checkbox') {
				if (!this.checked) {
					errorMsg = $this.data("validateErrorMsg") || "请勾选";
					return false;
				}
			} else {
				if (!this.value) {
					errorMsg = $this.data("validateErrorMsg") || "该字段必填或必选";
					return false;
				}
			}
			return true;
		},
		tel : function(){
			if (!this.hasAttribute("data-validate-tel")) {
				return true;
			}
			if(isNaN(this.value)||(this.value+'').length!=11){
				errorMsg = "请输入有效手机号";
				return false;
			}
			return true;
		},
		equal:function(){
			if (!this.hasAttribute("data-validate-equal")) {
				return true;
			}
			var $this = $(this);
			var id = $this.data("validateEqual");
			var equalValue = $('#'+id).val();
			if(this.value!=equalValue){
				errorMsg = "两次输入的值不一致";
				return false;
			}
			return true;
		},
		email:function(){
			var $this = $(this);
			if($this.attr('type')!='email') return true;
			errorMsg = "请输入有效的邮箱";
			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.value);
		}

	};
	var defaultOptions = {
		showSuccess : function(el) {
			var $el = $(el);
			$error = $el.data("$error")
			if ($error) {
				if ($el.parent().is('td')) {
					$el.parent().removeClass("has-error");
				} else if($el.parent().parent().is('td')) {
					$el.parent().parent().removeClass("has-error");
				} else {
					$el.closest(".form-group").removeClass("has-error");
				}
				$error.fadeOut();
				$el.data("$error", false);
			}

		},
		showError : function(el, $error) {
			var $el = $(el);
			if ($el.data("$error")) {
				$el.data("$error").text(errorMsg);
				return;
			}
			$el.data("$error", $error);
			$error.attr("id", el.id + "Error").text(errorMsg).hide();
			if ($el.parent().is('td')) {//对应表格
				$el.parent().addClass("has-error");
			} else if($el.parent().parent().is('td')) {//对应表格输入框组
				$el.parent().parent().addClass("has-error");
			} else {
				$el.closest(".form-group").addClass("has-error");
			}
			if ($el.prop("type") === "checkbox") {
				$el.closest(".checkbox").after($error);
			} else if ($el.parent().hasClass('input-group')) {
				$el.parent().after($error);
			} else {
				$el.after($error);
			}
			$error.fadeIn();
		},
		errorDom : '<div class="text-danger"></div>'
	};

	function dataValidate(options, event) {
		var el = this;
		if (event) {
			el = event.currentTarget;
		}
		if (!el.getAttribute("formnovalidate")) {
			var finalOptions = options || defaultOptions;
			var errorFlag;
			$.each(rule, function(i, fn) {
				return errorFlag = fn.call(el);
			}.bind(el));
			if (errorFlag) {
				finalOptions.showSuccess(el);
			} else {
				finalOptions.showError(el, $(finalOptions.errorDom));
			}
			return errorFlag;
		} else {
			return true;
		}
	}

	function onValidate(event) {
		dataValidate(null, event);
	}

	$(function() {
		$('input,textarea,select').on("blur", onValidate);
		$('select').on("change", onValidate);
		$('input[type="radio"]').add($('input[type="checkbox"]')).on("click", onValidate);

	});

	$.fn.extend({
		h5Validate : function(options) {
			if (this.attr("novalidate")) {
				return true;
			}
			var finalOptions = $.extend(true, {}, defaultOptions, options);
			var $inputList = this.find('input,textarea,select').reverse();
			var validateResult = true;
			var firstErrorEl;
			$inputList.each(function(i, el) {
				var result = dataValidate.call(el, finalOptions);
				validateResult = validateResult && result;
				if (!result)
					firstErrorEl = el;
			});
			firstErrorEl && firstErrorEl.focus();
			return validateResult;

		},
		reverse : function() {
			var length = this.length;
			for (var i = 0; i < length / 2; i++) {
				var temp = this[i];
				this[i] = this[length - 1 - i];
				this[length - 1 - i] = temp;
			}
			return this;
		},
		reOnValidate : function() {
			this.find('input,select').off("blur", onValidate);
			this.find('select').off("change", onValidate);
			this.find('input[type="radio"]').add(this.find('input[type="checkbox"]')).off("click", onValidate);
			this.find('input,select').on("blur", onValidate);
			this.find('select').on("change", onValidate);
			this.find('input[type="radio"]').add(this.find('input[type="checkbox"]')).on("click", onValidate);
			return this;
		}
	});

	$.extend({
		h5Validate : {
			setDefaults : function(options) {
				$.extend(true, defaultOptions, options);
			}
		}
	});
}));