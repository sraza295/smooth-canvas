import * as moment from 'moment';

import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import subjx from 'subjx';

declare const $: any;
var Draggables = [];
var contxt;
var observable = { value: function () { return } };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef;
  @ViewChild('canvasContainer1', { static: false }) canvasContainer1: ElementRef;
  @ViewChild('cloneDraggable', { static: false }) cloneDraggable: ElementRef;

  options: {};
  dcontrols
  timer

  meta_data = [];
  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer, public http: HttpClient) {
    contxt = this;


  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {
    const classElement = '.' + this.canvasContainer.nativeElement.classList.value as string;
    const classElementRestrict = '.restrict_container';
    const classElementClone = '.' + this.cloneDraggable.nativeElement.classList.value as string;
    this.options = {
      container: classElement,
      rotatable: false,
      rotationPoint: false,
      scalable: true,
      each: {
        move: false,
        resize: false,
        rotate: false
      },
      snap: {
        x: 0,
        y: 0,
        angle: 0
      },
      cursorMove: 'move',
      cursorRotate: 'crosshair',
      cursorResize: 'pointer',
      onInit(el) {
        // fires on tool activation
        //console.log('1 - Init 1', el);

      },
      onMove(dx, dy) {
        // fires on moving
        // console.log('2 - OnMove', dx, dy);

      },
      onResize(dx, dy, handle) {
        // fires on resizing
        // console.log('3 - OnResize', dx, dy, handle);
      },
      onDrop(e, el) {
        const stack = subjx(classElementRestrict)[0],
          offset = stack.getBoundingClientRect()
        // console.log('4 - isDropped' ,e,el, e.clientY - offset.top, e.clientX - offset.left);
        e.cancelBubble = true;
        // e.preventDefault();
        // e.stopPropagation();
        return false;
      },
      onDestroy(el) {
        // fires on tool deactivation
      },
      restrict: classElementRestrict
    }
    //  Draggables = subjx(classElementDraggable).drag(this.options);

    subjx(classElementClone).clone({
      stack: classElementRestrict,
      rotatable: false,
      scalable: true,
      rotationPoint: false,
      appendTo: classElementRestrict,
      onDrop(e, el, clone) {
        //             Draggables = subjx('.draggable').drag(this.options);
        const stack = subjx(classElementRestrict)[0],
          offset = stack.getBoundingClientRect(),
          div = document.createElement('div');


        div.classList.add('draggable');
        let type_element = el.getAttribute("elementval") //signature, initial, stamp, date_signed
        if (type_element == 'signature') {

          const b_64 = "data:image/jpeg;base64,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"
          div.innerHTML = "<img class='mainelementcontent' src='" + b_64 + "' width='200' height='80' style='height:100%;' id='" + contxt.makeid('signature') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);

        } else if (type_element == 'initial') {


          contxt.http.get('https://api.wesign.com/api/initial?user=10').pipe(map(data => {
            if (data['status_code'] === 200) {
              if (data['initial']['initial']) {
                div.innerHTML = "<img class='mainelementcontent' src='" + data['initial']['initial'] + "' width='200' height='80' style='height:100%;' id='" + contxt.makeid('initial') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
                contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
              }
            }
          })).subscribe(result => {
          });


        } else if (type_element == 'stamp') {

          contxt.NgxSmartModalService.getModal('stampoptions').open();
          // div.innerHTML = "<div class='stampouter mainelementcontent' id='" + contxt.makeid('stamp') + "'><div><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"

          // contxt.dropNext(div,e, offset, stack, classElement, classElementRestrict); 
        } else if (type_element == 'date_signed') {
          div.innerHTML = "<div class='dateouter mainelementcontent' id='" + contxt.makeid('stampdate') + "'>" + moment().format('MM/DD/YYYY') + "<div><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'full_name') {
          div.classList.add('editable_text');
          //div.innerHTML = "<div class='text_outer' contenteditable='true'>" + 'Santosh Panigrahy' + "<div>"
          div.innerHTML = "<input type='text' value='Santosh Panigrahy' class='text_outer mainelementcontent' id='" + contxt.makeid('fullname') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'first_name') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='Santosh' class='text_outer mainelementcontent' id='" + contxt.makeid('firstname') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'last_name') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='Panigrahy' class='text_outer mainelementcontent' id='" + contxt.makeid('lastname') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'email') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='santosh@amcrest.com' class='text_outer mainelementcontent' id='" + contxt.makeid('email') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'company') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='Amcrest' class='text_outer mainelementcontent' id='" + contxt.makeid('company') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'title') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='Project Manager' class='text_outer mainelementcontent' id='" + contxt.makeid('title') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'plain_text') {
          div.classList.add('editable_text');
          div.innerHTML = "<input type='text' value='Write here...' class='text_outer mainelementcontent' id='" + contxt.makeid('plaintext') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        } else if (type_element == 'checkbox') {
          div.innerHTML = "<input type='checkbox' checked readonly onClick='return false;' value='1' class='text_outer mainelementcontent' id='" + contxt.makeid('checkbox') + "'><img src='../../../assets/images_dev/close_icon.png' class='removebutton' (click)='removeElement($event)'>"
          contxt.dropNext(div, e, offset, stack, classElement, classElementRestrict);
        }


      },
      restrict: classElementRestrict
    });
    if (Draggables) {

      Draggables.forEach(item => {
        this.dcontrols = item.controls;
      });

    }
    this.renderer
  }

  onDrop = (e, el, clone) => {


  };

  dropNext(div, e, offset, stack, classElement, classElementRestrict) {
    div.style.setProperty('top', (e.clientY - offset.top) + 'px', "important");
    div.style.left = `${e.clientX - offset.left}px`;
    stack.appendChild(div);

    Draggables.push(...subjx(div).drag({
      container: classElement,
      rotatable: false,
      scalable: true,
      rotationPoint: false,
      each: {
        move: false,
        resize: false,
        rotate: false
      },
      snap: {
        x: 0,
        y: 0,
        angle: 0
      },
      cursorMove: 'move',
      cursorRotate: 'crosshair',
      cursorResize: 'pointer',
      onInit(el) {

        // fires on tool activation
        //console.log('6 - OnInit' , el);
        subjx('.draggable').on('click', e => {
          //e.preventDefault();
          //  e.stopPropagation();
          const stack = subjx(classElementRestrict)[0],
            offset = stack.getBoundingClientRect()
          //console.log('7 - draggable CLICKED', e, e.clientY - offset.top, e.clientX - offset.left);
          if (e.currentTarget.classList.contains('sjx-drag')) return;
          contxt.applyRemoveButton();
          e.cancelBubble = true;
          const xDraggable = subjx(e.currentTarget).drag(contxt.options)[0];
          Draggables.push(xDraggable);
          //sjx-controls

          //return false;
        });
        subjx('.drag_container').on('click', e => {
          // console.log('8 - container clicked',  e, e.clientX, e.clientY);
          $('.editable_text input').focus();
          clearTimeout(contxt.timer);
          contxt.timer = setTimeout(() => {
            Draggables.forEach(item => {
              item.disable();
              $('.removebutton').remove();
            });
          }, 2000)

        });




      },
      onMove(dx, dy) {
        // fires on moving
        // console.log('9 - on move', dx, dy);


      },
      onResize(dx, dy, handle) {
        // fires on resizing
        // console.log('10 - on resize', dx, dy, handle);
      },
      onDrop(e, el) {
        // console.log('11 - on drop', e, el, e.clientY - offset.top, e.clientX - offset.left);
        e.cancelBubble = true;
        //e.preventDefault();
        //e.stopPropagation();
        return false;
        // fires on drop
      },
      onDestroy(el) {
        // fires on tool deactivation
      },
      restrict: classElementRestrict
    }));

  }

  applyRemoveButton() {
    setTimeout(() => {
      $('.removebutton').remove();
      //$('.sjx-controls').append('<img src="../../../assets/images_dev/close_icon.png" class="removebutton">');
      $('.draggable').append('<img src="../../../assets/images_dev/close_icon.png" class="removebutton">');
      $('.removebutton').unbind('click').click((e) => {
        //alert("here");
        let index_element = $(".draggable").index($(e.target).parent());
        Draggables.splice(index_element, 1);
        $(e.target).parent().remove();
        clearTimeout(contxt.timer);
        contxt.timer = setTimeout(() => {

          Draggables.forEach(item => {
            item.disable();

          });
          setTimeout(() => {
            $('.sjx-wrapper').remove();
          }, 100)
        })
      })
    })
  }

  collectData() {
    if (Draggables.length) {
      console.log("AllDraggables", Draggables);
      if (Draggables[0]['options']) {
        if (Draggables[0]['options']['restrict']['children']) {

          for (let item of Draggables[0]['options']['restrict']['children']) {
            let cname = item.className;
            if (cname) {
              let cname_arr = cname.split(' ');

              if (cname_arr.includes('draggable')) {
                this.getPosition(item);

              }
            }
          }
        }
      }
      contxt.applyRemoveButton();
    }
    console.log("meta_data ", JSON.stringify(this.meta_data));
    this.sendEnvelope();
  }


  getPosition(element) {
    let arr_temp = $(element).find('.mainelementcontent').prop('id').split('-');



    if (arr_temp[0] == 'signature') {

    } else if (arr_temp[0] == "initial") {

    } else if (arr_temp[0] == "stamp") {

    } else if (arr_temp[0] == "stampdate") {

    } else if (arr_temp[0] == "fullname") {

    } else if (arr_temp[0] == "firstname") {

    } else if (arr_temp[0] == "lastname") {

    } else if (arr_temp[0] == "email") {

    } else if (arr_temp[0] == "company") {

    } else if (arr_temp[0] == "title") {

    } else if (arr_temp[0] == "plaintext") {

    } else if (arr_temp[0] == "checkbox") {

    }
    console.log(arr_temp[0] + ' with id -> ', arr_temp[1],
      "and Top->", parseInt($(element).css('top').slice(0, -2)) + (parseInt($(element).css('transform').split(',')[5]) ? parseInt($(element).css('transform').split(',')[5]) : 0),
      "Left->", parseInt($(element).css('left').slice(0, -1)) + (parseInt($(element).css('transform').split(',')[4]) ? parseInt($(element).css('transform').split(',')[4]) : 0),
      "Height->", $(element).outerHeight(), "Width->", $(element).width());

    const field_name = arr_temp[0];
    const signature_id = arr_temp[1];
    const top = parseInt($(element).css('top').slice(0, -2)) + (parseInt($(element).css('transform').split(',')[5]) ? parseInt($(element).css('transform').split(',')[5]) : 0);
    const left = parseInt($(element).css('left').slice(0, -1)) + (parseInt($(element).css('transform').split(',')[4]) ? parseInt($(element).css('transform').split(',')[4]) : 0);
    const height = $(element).outerHeight();
    const width = $(element).width();

    this.meta_data.push({
      "field_name": field_name,
      "signature_id": signature_id,
      "top": top,
      "left": left,
      "height": height,
      "width": width,
    })

    // this.sendEnvelope();
    //return { x: xPosition, y: yPosition };
  }
  makeid(prefix) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return prefix + '-' + result;
  }

  sendEnvelope() {
    console.log("meta_data ", this.meta_data)
  }

}
