if (typeof window.Step === 'undefined') {
  window.Step = class {
    constructor(container, structure, options = {}) {
      // console.log(structure)
      if (container && structure) {

        this.isAlone = structure.isAlone;

        this.icons = {
          standard: '<i class="fas fa-shoe-prints"></i>',
          locked: '<i class="fas fa-lock"></i>',
          warning: '<i class="fas fa-exclamation"></i>',
          validated: '<i class="fas fa-check"></i>',
          error: '<i class="fas fa-times"></i>'
        };

        if (structure.icons) {
          this.icons = {
            standard: structure.icons.standard
              ? structure.icons.standard
              : this.icons.standard,
            locked: structure.icons.locked
              ? structure.icons.locked
              : this.icons.locked.locked,
            warning: structure.icons.warning
              ? structure.icons.warning
              : this.icons.warning,
            validated: structure.icons.validated
              ? structure.icons.validated
              : this.icons.validated,
            error: structure.icons.error
              ? structure.icons.error
              : this.icons.error
          };
        }


        const element = document.createElement("li");

        //console.log(structure);

        const circle = document.createElement("span");
        circle.innerHTML = this.icons.standard;

        const title = document.createElement("span");
        title.innerHTML = structure.title;

        element.appendChild(circle);
        element.appendChild(title);

        if (!this.isAlone) {
          const before = document.createElement("span");
          const after = document.createElement("span");

          element.appendChild(before);
          element.appendChild(after);
        }

        if (structure.position) {
          element.classList.add(structure.position)
        }

        this.domTitle = title;
        this.domCircle = circle;
        this.element = element;

        this.tooltip = structure.tooltip ? structure.tooltip : '';

        container.appendChild(this.element);

        let tooltip = this.tooltip;
        [circle, title].forEach(function (element) {
          element.addEventListener("click", () => {
            // console.log('test')
            if (structure.action && typeof structure.action === "function") {
              structure.action();
            }
          });

          if (tooltip) element.setAttribute('onmouseover', 'makeTooltip(this)');

          //element.setAttribute('onmouseover', 'makeTooltip(this)');
          //element.addEventListener('mouseover', () =>{makeTooltip(this);})
        });
      }

      //Alla fine perchè devo aspettare che l'elemento venga renderizzato
      this.singleStepAnimation = structure.singleStepAnimation
        ? structure.singleStepAnimation
        : 1000;

      this._options = options


      //this.isRequired = structure.isRequired;
      this.isLocked = structure.isLocked;

    }

    get title() {
      return this._title;
    }

    set title(value) {
      this._title = value;

      if (this.domTitle) this.domTitle.innerHTML = this._title;
    }

    get tooltip() {
      return this._tooltip;
    }

    set tooltip(value) {
      this._tooltip = value;

      if (this.tooltip) {
        [this.domCircle, this.domTitle].forEach((element) => {
          element.setAttribute('alt', this.tooltip);
        });
      }
    }

    get isLocked() {
      return this._isLocked;
    }
    get isValidated() {
      return this._isValidated;
    }
    get hasError() {
      return this._hasError;
    }

    get hasWarning() {
      return this._hasWarning;
    }
    get isSelected() {
      return this._isSelected;
    }

    set isLocked(value) {
      if (!value) {
        //this.element.classList.remove('locked')
        //this.element.getElementsByTagName(
        //  "span"
        //)[0].innerHTML = this.icons.standard;
      } else {
        this.isSelected = false;
        this.hasWarning = false;
        this.hasError = false;
        this.isValidated = false;

        this.element.classList.add("locked");
        this.element.getElementsByTagName(
          "span"
        )[0].innerHTML = this.icons.locked;
      }

      this._isLocked = value;
    }

    set isValidated(value) {
      if (this.isLocked) {
        console.error(
          "Non è possibile modificare le proprietà di questo step in quanto risulta bloccato."
        );
      } else {
        this._isValidated = value;

        if (!this.isValidated) {
          this.element.classList.remove("visited");
          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.standard;
        } else {
          this.hasWarning = false;
          this.hasError = false;

          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.validated;
          this.element.classList.add("visited");
        }
      }
    }

    set hasError(value) {
      if (this.isLocked) {
        console.error(
          "Non è possibile modificare le proprietà di questo step in quanto risulta bloccato."
        );
      } else {
        this._hasError = value;

        if (!this.hasError) {
          this.element.classList.remove("error");
          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.standard;
        } else {
          this.hasWarning = false;
          this.isValidated = false;

          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.error;
          this.element.classList.add("error");
        }
      }
    }
    set hasWarning(value) {
      if (this.isLocked) {
        console.error(
          "Non è possibile modificare le proprietà di questo step in quanto risulta bloccato."
        );
      } else {
        this._hasWarning = value;

        if (!this.hasWarning) {
          this.element.classList.remove('warning');
          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.standard;
        } else {
          this.hasError = false;
          this.isValidated = false;

          this.element.getElementsByTagName(
            "span"
          )[0].innerHTML = this.icons.warning;
          this.element.classList.add('warning');
        }
      }
    }

    set isSelected(value) {
      if (this.isLocked) {
        console.error(
          "Non è possibile modificare le proprietà di questo step in quanto risulta bloccato."
        );
      } else {
        this._isSelected = value;

        if (this.isSelected) {
          this.element.classList.add("current");
        } else {
          this.element.classList.remove("current");
        }
      }
    }

    set singleStepAnimation(value) {
      this._singleStepAnimation = value;

      if (!this.isAlone) {
        this.element.getElementsByTagName("span")[2].style.transition =
          this.singleStepAnimation + "ms";
        this.element.getElementsByTagName("span")[3].style.transition =
          this.singleStepAnimation + "ms";
      }
    }
    get singleStepAnimation() {
      return this._singleStepAnimation;
    }
    remove() {
      this.element.remove();
    }

  }
}

if (typeof window.StepBar === 'undefined') {
  window.StepBar = class {
    steps = []; // Contenitore di tutti gli step
    constructor(container, options = {}) {
      if (container) {
        this._options = options;
        //console.log(options)

        const element = document.createElement("ul");
        element.id = "progressbar";
        element.classList.add("progress-bar");

        this.element = element;
        container.appendChild(this.element);
      }
    }

    add(structure) {
      let isValidStep = true;
      for (const step of this.steps) {
        if (step.title === structure.title) {
          isValidStep = false;
          break;
        }
      }

      if (isValidStep) {
        let counter = this.steps.push(new Step(this.element, structure));

        // console.log(counter, this._options)

        if (!this._options.currentStep && counter === 1) {
          this.moveFirst();
        } else if (this._options.currentStep && this._options.currentStep === --counter) {
          //  console.log('dentro')
          this.currentStep = this._options.currentStep
        }
      }
    }

    remove(index) {
      let step = this.steps[index];
      if (step) {
        this.steps.splice(index, 1);
        step.remove();
      }
    }

    clear() {
      let list = []
      this.steps.forEach((step, index) => {
        if (step) {
          list.unshift(index)
          step.remove();
        }
      })

      //  console.log(this.steps)
      list.forEach(element => {
        this.steps.splice(element, 1);
        //   console.log(this.steps.length)
      })
    }
    validate(index = this.currentStep, state = true) {
      //index = index ? index : this.currentStep; /*non va bene perchè con lo step 0 va in botta*/
      index = index === undefined ? this.currentStep : index; /*22/06/2022 Alex: Cambiata l'asseganzione perchè js converte 0 in false*/
      if (this.steps[index]) {
        this.steps[index].isValidated = state;
      }
    }

    error(index = this.currentStep, state = false) {
      if (this.steps[index]) {
        this.steps[index].hasError = state;
      }
    }
    warning(index = this.currentStep, state = false) {
      index = index ? index : this.currentStep;
      if (this.steps[index]) {
        this.steps[index].hasWarning = state;
      }
    }
    lock(index = this.currentStep, state = false) {
      index = index ? index : this.currentStep;

      if (this.steps[index]) {
        this.steps[index].isLocked = state;
      }
    }

    tooltip(index = this.currentStep, value = '') {
      index = index ? index : this.currentStep;

      if (this.steps[index]) {
        this.steps[index].tooltip = value;
      }
    }

    title(index = this.currentStep, value = '') {
      index = index ? index : this.currentStep;

      if (this.steps[index]) {
        this.steps[index].title = value;
      }
    }


    set currentStep(value) {
      // console.log('setter della madonna', value)
      const step = this.steps[value];
      //  console.log(this.steps, this.steps[5])
      if (step && !step.isLocked) {
        if (this.steps[this.currentStep]) {
          this.steps[this.currentStep].isSelected = false;
        }

        this._currentStep = value;
        step.isSelected = true;
      }
    }
    get currentStep() {
      return this._currentStep;
    }

    // Move to the next step
    moveNext() {
      let index = this.currentStep + 1;

      for (index; index < this.steps.length; index++) {
        const step = this.steps[index];
        if (step && !step.isLocked) {
          break;
        }
      }

      index = this.steps[index] ? index : this.steps.length - 1;

      this.currentStep = index;
    }

    // Move to the previous step
    movePrevious() {
      let index = this.currentStep - 1;
      index = this.steps[index] ? index : 0;

      this.currentStep = index;
    }

    // Move to the first step
    moveFirst() {
      this.currentStep = 0;
    }

    // Move to the last step
    moveLast() {
      this.currentStep = this.steps.length - 1;
    }

    // Count the validated steps
    validatedSteps() {
      let counter = 0;

      for (const step of this.steps) {
        if (step.isValidated) {
          counter++;
        }
      }

      return counter;
    }
  }
}