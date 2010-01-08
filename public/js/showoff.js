/* ShowOff JS Logic */

var preso_started = false
var slidenum = 0
var slideTotal = 0
var slides
var totalslides = 0
var slidesLoaded = false

function setupPreso() {
  if (preso_started)
  {
     alert("already started")
     return
  }
  preso_started = true

  loadSlides()

  // bind event handlers
  document.onkeydown = keyDown
  /* window.onresize  = resized; */
  /* window.onscroll = scrolled; */
  /* window.onunload = unloaded; */
}

function loadSlides() {
  $('#slides').hide();
  $("#slides").load("/slides", false, function(){
    slides = $('#slides > .slide')
    slideTotal = slides.size()
    setupMenu()
    if (slidesLoaded) {
      showSlide()
    } else {
      showFirstSlide()
      slidesLoaded = true
    }
   })
}

function ListMenu()
{
  this.typeName = 'ListMenu'
  this.itemLength = 0;
  this.items = new Array();
  this.addItem = function (key, text, slide) {
    if (key.length > 1) {
      thisKey = key.shift()
      if (!this.items[thisKey]) {
        this.items[thisKey] = new ListMenu
      }
      this.items[thisKey].addItem(key, text, slide)
    } else {
      thisKey = key.shift()
      this.items[thisKey] = new ListMenuItem(text, slide)
    }
  }
  this.getList = function() {
    var newMenu = $("<ul>")
    for(var i in this.items) {
      var item = this.items[i]
      var domItem = $("<li>")
      if (item.typeName == 'ListMenu') {
        choice = $("<a href=\"#\">" + i + "</a>")
        domItem.append(choice)
        domItem.append(item.getList())
      }
      if (item.typeName == 'ListMenuItem') {
        choice = $("<a rel=\"" + (item.slide - 1) + "\" href=\"#\">" + item.slide + '. ' + item.textName + "</a>")
        domItem.append(choice)
      }
      newMenu.append(domItem)
    }
    return newMenu      
  }
}

function ListMenuItem(t, s)
{
  this.typeName = "ListMenuItem"
  this.slide = s
  this.textName = t
}

function setupMenu() {
  var currSlide = 0
  var menu = new ListMenu()
  
  slides.each(function(s, elem) {
    shortTxt = $(elem).text().substr(0, 20)
    path = $(elem).attr('ref').split('/')
    currSlide += 1
    menu.addItem(path, shortTxt, currSlide)
  })

  $('#navigation').html(menu.getList())
  $('#navmenu').menu({ 
    content: $('#navigation').html(),
    flyOut: true
  });
}

function gotoSlide(slideNum) {
  slidenum = parseInt(slideNum)
  showSlide()
}

function showFirstSlide() {
  slidenum = 0
  showSlide()
}

function showSlide() {
  if(slidenum < 0) {
    slidenum = 0
  }
  if(slidenum > (slideTotal - 1)) {
    slidenum = slideTotal - 1
  }
  $("#preso").html(slides.eq(slidenum).clone())
  $("#slideInfo").text((slidenum + 1) + ' / ' + slideTotal)
  curr_slide = $("#preso > .slide")
  var slide_height = curr_slide.height()
  var mar_top = (0.5 * parseFloat($("#preso").height())) - (0.5 * parseFloat(slide_height))
  $("#preso > .slide").css('margin-top', mar_top)
}

//  See e.g. http://www.quirksmode.org/js/events/keys.html for keycodes
function keyDown(event)
{
    var key = event.keyCode;

    if (event.ctrlKey || event.altKey || event.metaKey)
       return true;

    if (key == 32) // space bar
    {
      slidenum++
      showSlide()
    }
    else if (key == 37) // Left arrow
    {
      slidenum--
      showSlide()
    }
    else if (key == 39) // Right arrow
    {
      slidenum++
      showSlide()
    }
    else if (key == 82) // R for reload
    {
      if (confirm('really reload slides?')) {
        loadSlides()
        showSlide()
      }
    }
    else if (key == 84 || key == 67)  // T or C for table of contents
    {
    }
    else if (key == 72) // H for help
    {
    }

    return true
}
