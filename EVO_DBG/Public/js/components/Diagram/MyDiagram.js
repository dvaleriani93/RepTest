// **************************************************************
// Class MyDiagram: represents an element of type MyDiagram
// **************************************************************

function MyDiagram(pform) {
  // Call base constructor
  CustomElement.call(this, pform);
  //
  //this.viewType = "dayGridMonth";
  //this.currentDate = new Date();
}
//
// Define extension of class
MyDiagram.prototype = new CustomElement();

// **************************************************************
// Init the element
// **************************************************************
MyDiagram.Init = function () {
  if (MyDiagram.inited)
    return;
  //
  var pthis = this;
  CustomElement.LoadRequirements("public/js/components/Diagram/lib/diagram.css", "CSS");
  CustomElement.LoadRequirements("public/js/components/Diagram/MyDiagram.css", "CSS");
  var calJS = [
    "public/js/components/Diagram/lib/diagram.js"];
  CustomElement.LoadRequirements(calJS, "JS", function () {
    MyDiagram.inited = true;
    if (MyDiagram.toRealize) {
      pthis.Realize(MyDiagram.toRealize);
      delete MyDiagram.toRealize;
    }
  });
}
MyDiagram.Init();

Object.defineProperty(MyDiagram.prototype, "data", {
  get: function () {
    return this.diagram.data;
  },
  set: function (value) {
    if (this.diagram) {
      this.diagram.data.parse(value);
    } else {
      this._data = value;
    }
  }
});

Object.defineProperty(MyDiagram.prototype, "opts", {
  get: function () {
    return this._opts;
  },
  set: function (value) {
    this._opts = value;
  }
});												
// ***************************************************************
// Create DOM objects useful for this object
// The parent object tells the object where it should be contained
// its child objects in the DOM
// ***************************************************************
MyDiagram.prototype.Realize = function (parent) {
  if (!MyDiagram.inited) {
    MyDiagram.toRealize = parent;
    return;
  }
  //
  // Call base method
  CustomElement.prototype.Realize.call(this, parent);
  //
  var pthis = this;
  //
  // Create the div that contains the diagram
  this.diagramDiv = document.createElement("div");
  parent.appendChild(this.diagramDiv);
  //
  // Set the options
  this._data = this._data || {};
  this._opts = this._opts || {};
  //
  // Create and show the diagram
  this.diagram = new dhx.Diagram(this.diagramDiv, this._opts);

  //Gli tolgo l'overflow perchè sono cazzi miei e non suoi
  parent.style.overflow = "";

  //QUI VANNO MESSI GLI EVENTI!!!!!
  this.diagram.events.on("shapeClick", function (id) {
	delete id;  
    if (typeof id !== "string") {
      id = id.toString();
    }
	let oShape = this.data.getItem(id);
	let oNewShape = {};
	oNewShape = componiShapePerInde(oShape);
	
    pthis.SendEvent("OnShapeClick",[id, oNewShape]);
  });

  /*
  this.diagram.events.on("shapeDblClick", function (id) {
	delete id;  
    if (typeof id !== "string") {
      id = id.toString();
    }
    pthis.SendEvent("OnShapeDoubleClick",[id]);
  });*/
  
  /*
  this.diagram.events.on("shapeHover", function (id,evento) {
	delete id;  
	delete evento;  
  pthis.SendEvent("OnShapeHover",[id]);
  });*/
  

  /*
  this.diagram.events.on("AfterSelect", function (id) {
	delete id;  
  pthis.SendEvent("OnAfterSelect",[id]);
  });*/

  this.diagram.events.on("emptyAreaClick", function (evento) {
	delete evento;  
  pthis.SendEvent("OnEmptyAreaClick");
  });

  this.diagram.data.parse(this._data);
  setTimeout(function () {
    pthis.diagram.paint();
  }, 250);
}

// ***************************************************************
// Destroy all objects of this object
// ***************************************************************
MyDiagram.prototype.Destructor = function () {
  this.diagram.destructor();
  delete this.diagram;
}

// ***************************************************************
// AddShape
// ***************************************************************
MyDiagram.prototype.DataAdd = function (NewShape) {
  this.diagram.data.add(NewShape);
}

// ***************************************************************
// RemoveShape
// ***************************************************************
MyDiagram.prototype.DataRemove = function (ShapeID) {
  this.diagram.data.remove(ShapeID);
}

// ***************************************************************
// RemoveAllShape
// ***************************************************************
MyDiagram.prototype.DataRemoveAll = function () {
  this.diagram.data.removeAll();
}

// ***************************************************************
// UpdateShape
// ***************************************************************
MyDiagram.prototype.DataUpdate = function (ShapeID, Parameters) {
  this.diagram.data.update(ShapeID, Parameters);
}

// ***************************************************************
// AutoPlace
// ***************************************************************
MyDiagram.prototype.AutoPlace = function (config) {
  if (!config) {
    this.diagram.autoPlace();
  } else {
    this.diagram.autoPlace(config);
  }
}

// **************************************************************
// Re Render
// **************************************************************
MyDiagram.prototype.Paint = function () {
  this.diagram.paint();
}						

MyDiagram.prototype.AddFlowView = function (type, Configurazione) {

this.diagram.addShape(type, {
    template: template,
    defaults: {
        width: 190,
        height: 97,
    },
});
}

function template({ title, view, cr, br, conversion, link }) {
	const conversionVisable = conversion > 15 ? "inline-block" : "none";
	return `
		<div class="dhx_diagram_template_b" style="background-image: url(${view});">
			<div class="dhx_diagram_template_b__cover dhx_diagram_template_b__cover--visibility" aria-haspopup="true">
				<div class="dhx_diagram_template_b__title">${title}</div>
				<div class="dhx_diagram_template_b__info">
					<div class="dhx_diagram_template_b__item">
						CR
						<span class="dhx_diagram_template_b__value">${cr}%</span>
					</div>
					<div class="dhx_diagram_template_b__item">
						BR
						<span class="dhx_diagram_template_b__value">${br}%</span>
					</div>
				</div>
			</div>
			<div class="dhx_diagram_template_b__control">
				<span class="dhx_diagram_template_b__button info">
					<span class="dhx_diagram_template_b__icon mdi mdi-information-outline"></span>
				</span>
				<span class="dhx_diagram_template_b__button">
					<a class="dhx_diagram_template_b__link" href="${link}" target="_blank"></a>
					<span class="dhx_diagram_template_b__icon mdi mdi-link-variant"></span>
				</span>
			</div>
			<div class="dhx_diagram_template_b__lable" style="display:${conversionVisable}">+${conversion}%</div>
		</div>
	`
}


MyDiagram.prototype.AddAnagrafica = function () {

this.diagram.addShape("anagrafica", {
    template: anagrafica,
    defaults: {
        width: '220',
        height: '120',
		title:'',
		counter:'',
		text1:'',
		text2:'',
    },
    eventHandlers: {
        onclick: {
            diag_anagrafica_cta: function(event, item) {
                diag_ApriVideata(item.text1);
            },
        }
    },
});
}


function anagrafica({ title, counter, text1, text2}) {
    return `
            <section class="diag_anagrafica">
                <div class="diag_anagrafica_container">
                    <div class="diag_anagrafica_header"><h3> ${title}</h3></div>
                    <div class="diag_anagrafica_cta"> Vai a ${title} </div>
                    <div class="diag_anagrafica_footer">
                        <div class="diag_anagrafica_counter">${counter}</div>
                        <div class="diag_anagrafica_content">${text1} - ${text2}</div>
                    </div>
                </div>
            </section>
    `
}

function diag_ApriVideata(sTipologia) {
	var sJS = "DIAGRAMMA&TIPOLOGIA=" + sTipologia + ""
	sJS = sJS + 
	RD3_SendCommand(sJS);
}
MyDiagram.prototype.LoadCss= function(path){
  CustomElement.LoadRequirements(path, "CSS");
}

MyDiagram.prototype.AddShape =  function (type, obj, arrTemplate, arrClassNames, arrOnClick) {
  let myTemplate = CreateFunc(arrTemplate);
  obj.template = myTemplate;
  
  for (let i = 0; i < arrOnClick.length; i++) {
	let myOnClick = CreateFunc(arrOnClick[i]).bind(this);
	obj.eventHandlers.onclick[arrClassNames[i]] = myOnClick;
  }

  this.diagram.addShape(type, obj);
}


function escapeHTML(text) {
    return text.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
}

function componiShapePerInde(oShape) {
	let oNewShape = {};
	oNewShape.id = oShape.id
	oNewShape.type = oShape.type
	oNewShape.x = oShape.x
	oNewShape.y = oShape.y
	oNewShape.angle = oShape.angle
	oNewShape.text = oShape.text
	oNewShape.editable = oShape.editable
	oNewShape.height = oShape.height
	oNewShape.width = oShape.width
	oNewShape.fixed = oShape.fixed
	oNewShape.hidden = oShape.hidden
	oNewShape.css = oShape.css
	oNewShape.fill = oShape.fill
	oNewShape.stroke = oShape.stroke
	oNewShape.strokeWidth = oShape.strokeWidth
	oNewShape.strokeType = oShape.strokeType
	oNewShape.strokeDash = oShape.strokeDash
	oNewShape.fontColor = oShape.fontColor
	oNewShape.fontStyle = oShape.fontStyle
	oNewShape.fontWeight = oShape.fontWeight
	oNewShape.fontSize = oShape.fontSize
	oNewShape.textAlign = oShape.textAlign
	oNewShape.textVerticalAlign = oShape.textVerticalAlign
	oNewShape.lineHeight = oShape.lineHeight
	
    return oNewShape;
}

function CreateFunc(arr) {
	let par1, par2, par3, par4, par5, par6, par7, par8, par9, par10, body = arr[arr.length - 1];
	
	//Tolgo 1 che l'ultimo è il body
	for (let i = 0; i < (arr.length - 1); i++) {
		switch (i) {
			case 0 :
				par1 = arr[i];
				break;
				
			case 1 :
				par2 = arr[i];
				break;
				
			case 2 :
				par3 = arr[i];
				break;
				
			case 3 :
				par4 = arr[i];
				break;
				
			case 4 :
				par5 = arr[i];
				break;
				
			case 5 :
				par6 = arr[i];
				break;
				
			case 6 :
				par7 = arr[i];
				break;
				
			case 7 :
				par8 = arr[i];
				break;
				
			case 8 :
				par9 = arr[i];
				break;
				
			case 9 :
				par10 = arr[i];
				break;
		}
	}
	
	//Tolgo 1 che l'ultimo è il body
	switch (arr.length - 1) {
		case 1 :
			return new Function(par1, body);
			break;
			
		case 2 :
			return new Function(par1, par2, body);
			break;
			
		case 3 :
			return new Function(par1, par2, par3, body);
			break;
			
		case 4 :
			return new Function(par1, par2, par3, par4, body);
			break;
			
		case 5 :
			return new Function(par1, par2, par3, par4, par5, body);
			break;
			
		case 6 :
			return new Function(par1, par2, par3, par4, par5, par6, body);
			break;
			
		case 7 :
			return new Function(par1, par2, par3, par4, par5, par6, par7, body);
			break;
			
		case 8 :
			return new Function(par1, par2, par3, par4, par5, par6, par7, par8, body);
			break;
			
		case 9 :
			return new Function(par1, par2, par3, par4, par5, par6, par7, par8, par9, body);
			break;
			
		case 10 :
			return new Function(par1, par2, par3, par4, par5, par6, par7, par8, par9, par10, body);
			break;
	}
}

////////EXPORT PDF/////////
MyDiagram.prototype.ExportPdf = function (pdf=null) {
  console.log(pdf);
  if (pdf)
    this.diagram.export.pdf(pdf);
}
//////////GET ITEM BY ID///////////
MyDiagram.prototype.shapeExists = function (id) {
  const shapeExists = diagram.data.exists("1");
  return shapeEaxists;
}