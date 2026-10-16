/* Keep the search UI and catalogue work outside the initial shell. */
(function(global){
  'use strict';
  var pending=null,wanted=false;
  function show(){
    wanted=true;
    if(global.PegaSearchView){global.PegaSearchView.show();return Promise.resolve();}
    if(pending)return pending;
    pending=global.QuilynRuntime.search().then(function(view){if(wanted)view.show();}).catch(function(){if(wanted)global.alert('Search is unavailable. Check your connection and try again.');}).finally(function(){pending=null;});
    return pending;
  }
  function hide(){wanted=false;if(global.PegaSearchView)global.PegaSearchView.hide();}
  document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();show();}});
  global.PegaSearch={show:show,hide:hide};
})(window);
