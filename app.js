var canvas = document.getElementById("draw");
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.beginPath();

	function Input(text = "", options = {}){
		this.text = text;
		this.options = Object.assign({width: 250, height: 40, font: "17px Arial", borderWidth: 1, borderColor: "#ccc", padding: 5}, options);
		this.position = {x: 10, y: 10};
		this.isFocus = false;
		this.focusIndex = text.length;
		this.isCommandKey = false;
		this.selected = false;

		this.render = function(){
			ctx.clearRect(this.position.x, this.position.y, this.options.width, this.options.height);
			ctx.font = this.options.font;
			ctx.lineWidth = this.options.borderWidth;
			ctx.strokeStyle = this.options.borderColor;
			if(this.isFocus){
				ctx.strokeStyle = "#000";
			}
			ctx.rect(this.position.x, this.position.y, this.options.width, this.options.height);
			ctx.stroke();

			// write text
			var str = "";
			for(var i = 0; i < this.text.length; i++){
				if(!this.selected && this.isFocus && this.focusIndex === i){
					str += "|";
				}
				str += this.text[i];
			}
			if(!this.selected && this.isFocus && this.focusIndex === this.text.length){
				str += "|";
			}

			if(this.selected){
					var _width = ctx.measureText(this.text).width;
					ctx.fillStyle = 'rgba(0,0,0,0.5)';
				 	ctx.fillRect(this.position.x + this.options.padding, this.position.y + this.options.padding, _width, parseInt(this.options.font, 17));
				 
			}

			ctx.fillStyle = "#000";
			ctx.fillText(str, this.position.x + this.options.padding,  this.position.y + (this.options.height / 2) + this.options.padding);

		}

		this.handleOnClick = function(e){
			let clientX = e.clientX;
			let clientY = e.clientY;
			if(clientX <= this.position.x + this.options.width && clientX >= this.position.x && clientY <= this.position.y + this.options.height && clientY >= this.position.y){
				if(!this.isFocus){
					this.isFocus = true;
					this.focusIndex = this.text.length;
					this.render();
				}
			}else{
				if(this.isFocus){
					this.selected = false;
					this.isFocus = false;
					this.render();
				}
				
			}
		}

		this.handleOnKeyUp = function(e){
			this.isCommandKey = false;
			this.render();
		}

		this.handleOnKeyDown = function(e){
			if(e.key === "Meta" || e.key === "Control"){
				this.isCommandKey = true;
			}
			if(this.isFocus){
				e.preventDefault();
			}
			if(this.isCommandKey && e.key === "a"){
				this.selected = true;
				this.render(); 
				return 
			}
			if(this.isFocus && e.key === "Backspace"){
				if(this.selected){
					this.focusIndex = 0;
					this.text = "";
					this.selected = false;
					this.render();
				}
				var str = "";
				for(var i =0; i < this.text.length; i++){
					if(i !== this.focusIndex - 1){
						str += this.text[i];
					}
				}

				this.text = str;

				this.focusIndex --;
				if(this.focusIndex <0){
					this.focusIndex = 0;
				}
				this.render();
			}
			if(this.isFocus && e.key === "ArrowLeft"){
				this.focusIndex --;
				if(this.focusIndex < 0){
					this.focusIndex = 0;
				}
				this.render();
			}
			if(this.isFocus && e.key === "ArrowRight"){
				this.focusIndex ++;
				if(this.focusIndex > this.text.length){
					this.focusIndex = this.text.length;
				}
				this.render();
			}
			if(!this.isCommandKey && this.isFocus && (e.keyCode == 32 || (e.keyCode >= 65))){
				this.text += e.key;
				this.focusIndex = this.text.length;
				this.render();
			}


		}
	}
	
	var input = new Input("I 'm an input");
	input.render();

	window.addEventListener("click", function(event){
			input.handleOnClick(event);
	});
	window.addEventListener("keydown", function(event){
			input.handleOnKeyDown(event);
	});
	window.addEventListener("keyup", function(event){
			input.handleOnKeyUp(event);
	});