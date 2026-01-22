

const NaviComp = {
  props:{
    navigation: Number,
    total: Number
  },
  emits: ['navigate', 'finalize'],
  template: `
    <div class="w-full p-5 grid grid-cols-2 gap-5 text-center max-w-xl mx-auto animate__animated animate__fadeInDown" v-if="visible">
      <div class="rounded-lg  p-2  font-bold cursor-pointer border-4 transition-all" @click="navigatePage('prev')" :class="!canPrev()?'text-dfgray':'dfgradientgray dfgradienthover text-white'">Anterior</div>
      <div class="rounded-lg  p-2  font-bold cursor-pointer border-4 transition-all" @click="navigatePage('next')" :class="!canNext()?'text-dfgray':'dfgradient dfgradienthover text-white active:scale-110'">Siguiente</div>
    </div>

    <div class="flex gap-0.5 justify-center">
      <!--<div v-for="(item, index) in this.total" :class="['w-4 h-4 rounded-full cursor-pointer ring-offset-2 hover:bg-dforange hover:ring hover:ring-dforange', item==this.navigation?'dfgradientblue':'bg-slate-300']" @click="navigateTo(item)"></div>-->
      <div v-for="(item, index) in this.total" :class="['w-6 h-4 rounded-sm  ring-offset-2 flex justify-center items-center', item==this.navigation?'dfgradientblue':'bg-slate-300']">
        <span class="text-xs text-white font-bold">{{item}}</span>
      </div>
      
    </div>  

  `,
  data(){return{
    visible: false
  }},
  methods: {
    canNext(){
      return this.navigation < this.total+1
    },
    canPrev(){
      return this.navigation > 1
    },
    navigatePage (dir) {
      let clicked = false
      if (dir === 'next' && this.canNext()) {
        this.$emit('navigate', this.navigation + 1);
        clicked = true
      } else if (dir === 'prev' && this.canPrev()) {
        this.$emit('navigate', this.navigation - 1);
        clicked = true
      }
      if(clicked){
        this.visible = false
        setTimeout(()=>{
          this.visible = true
        }, 1200)
      }
    },
    navigateTo (num) {
      this.$emit('navigate', num)
      this.visible = false
        setTimeout(()=>{
          this.visible = true
        }, 1200)
    },
    finalizeFn () {
      this.$emit('finalize', true)
    }
  },
  mounted () {
    setTimeout(()=>{
      this.visible = true
    }, 1000)
  }
}

const AcuerdoComp = {
  props: {
    data: Object,
    options: Object,
    userdata: Object,
  },
  template: `
    
    <div class="acuerdocomp  flex flex-col gap-1 md:gap-4 m-0 md:m-5">
      <h2 class="font-bold text-dfgray text-base md:text-xl"><span class="opacity-50 text-xl md:text-2xl">{{data.id}}.</span> {{data.texto}}</h2>
      <div v-for="(sec, sindex) in data.secundarios" class="m-1 md:m-5">
        <template v-if="ismounted">
          <h3 class="text-dfgray text-base md:text-2xl animate__animated animate__fadeInDown ">{{sec.texto}}</h3>
          <div class="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-5 lg:gap-5 xl:gap-10 my-5 animate__animated animate__fadeIn animate__delay-1s"> 
              <!-- option -->
                <div v-for="(opc, oindex) in getOptions(sec.id)" class="flex flex-col cursor-pointer" @click="handleClick(opc)">
                  <!--img -->
                  <div class="aspect-square w-10/12 rounded-xl mx-auto z-10 relative flex justify-center items-center max-w-40 transition-all duration-500 bg-dfgray">
                      <div class="bg-dfgray absolute inset-0 rounded-xl dfgradient transition-all duration-500" :class="isChecked(opc.id)?'opacity-100':'opacity-0'"></div>
                      <div class="border-4 border-white w-6 aspect-square rounded-full absolute top-1 right-1 flex justify-center items-center z-20 transition-all " :class="isChecked(opc.id)?'bg-white shadow-md w-10 duration-200':'shadow-xs bg-white/50 duration-1000'">
                        <img src="app/img/check.svg" class="w-4/5" :class="isChecked(opc.id)?'opacity-100 duration-500':'opacity-0 duration-1000'">
                      </div>
                      <div class="optionimage w-11/12 aspect-square bg-white">
                            <img :src="imgname(opc.id)" class="transition-all duration-300" :class="isChecked(opc.id)?'':'grayscale'">
                      </div>
                    </div>

                  <!-- txt -->
                  <div class="grow pt-20 overflow-hidden pb-2 text-dfgray rounded-xl bg-white leading-4 md:leading-5 text-sm md:text-base text-center -mt-16 z-0 relative border-2">
                    <div class="bg-dforangedark  w-full absolute top-0 l-0 z-0 magicborder transition-all duration-500" :class="isChecked(opc.id)?'h-full':'h-0'"></div>
                    <div class="bg-white rounded-lg absolute inset-1 z-10"></div>
                    <div class="w-full p-2 h-full  z-50 relative transition-all duration-1000" :class="isChecked(opc.id)?' text-dfpinkdark font-bold':'opacity-70'">
                      {{opc.texto}}
                    </div>
                  </div>

              </div>
          </div><!-- opciones -->
        </template>
      </div>
    </div>
  `,
  data (){
    return {
      ismounted:false
    }
  },
  methods: {
    imgname(imgId) {
      const primaryId = this.data.id;
      return 'app/img/op/' + primaryId + '/i' + imgId + '.jpg';
    },
    getOptions(secondaryId) {
      const primaryId = this.data.id;
      return this.options.filter(option => option.primary === primaryId && option.secondary === secondaryId);
    },
    handleClick(opc) {
      this.$emit('clicked', opc);
    },
    isChecked(id) {
      return !!this.userdata[id]?.check;
    }
  },
  mounted(){
    this.ismounted = true
    setTimeout(()=>{
    }, 500)
  }
}





const app = Vue.createApp({
  data (){
    return {
      acuerdodata: dataAcuerdo,
      acuerdooptions: dataAcuerdoOptions,
      userdata: {},
      navigation: 1,
      loading: false,
      loadTemplate:{
        A2024SG: "{\"navigation\":1,\"userdata\":{\"1\":{\"check\":true},\"2\":{\"check\":true},\"3\":{\"check\":true},\"4\":{\"check\":true},\"5\":{\"check\":true},\"6\":{\"check\":false},\"7\":{\"check\":false},\"8\":{\"check\":true},\"9\":{\"check\":false},\"10\":{\"check\":false},\"11\":{\"check\":true},\"12\":{\"check\":false},\"13\":{\"check\":false},\"14\":{\"check\":true},\"15\":{\"check\":true},\"16\":{\"check\":true},\"17\":{\"check\":true},\"18\":{\"check\":true},\"19\":{\"check\":false},\"20\":{\"check\":true},\"21\":{\"check\":true},\"22\":{\"check\":true},\"23\":{\"check\":true},\"24\":{\"check\":true},\"25\":{\"check\":false},\"26\":{\"check\":false},\"27\":{\"check\":true},\"28\":{\"check\":false},\"29\":{\"check\":true},\"30\":{\"check\":false},\"31\":{\"check\":false},\"32\":{\"check\":false},\"33\":{\"check\":true},\"34\":{\"check\":false},\"35\":{\"check\":false},\"36\":{\"check\":true},\"37\":{\"check\":false},\"38\":{\"check\":false},\"39\":{\"check\":true},\"40\":{\"check\":true},\"41\":{\"check\":true},\"42\":{\"check\":true},\"43\":{\"check\":false},\"44\":{\"check\":true},\"45\":{\"check\":true},\"46\":{\"check\":true},\"47\":{\"check\":true},\"48\":{\"check\":true},\"49\":{\"check\":true},\"50\":{\"check\":false},\"51\":{\"check\":true},\"52\":{\"check\":true},\"53\":{\"check\":false},\"54\":{\"check\":true},\"55\":{\"check\":true},\"56\":{\"check\":true},\"57\":{\"check\":true},\"58\":{\"check\":false},\"59\":{\"check\":false},\"60\":{\"check\":true},\"61\":{\"check\":true},\"62\":{\"check\":true},\"63\":{\"check\":false},\"64\":{\"check\":false},\"65\":{\"check\":true},\"66\":{\"check\":true},\"67\":{\"check\":false},\"68\":{\"check\":true},\"69\":{\"check\":false},\"70\":{\"check\":false},\"71\":{\"check\":false},\"72\":{\"check\":false},\"73\":{\"check\":false},\"74\":{\"check\":true},\"75\":{\"check\":true},\"76\":{\"check\":false},\"77\":{\"check\":false},\"78\":{\"check\":true},\"79\":{\"check\":false},\"80\":{\"check\":false},\"81\":{\"check\":true},\"82\":{\"check\":true},\"83\":{\"check\":false},\"84\":{\"check\":false},\"85\":{\"check\":true},\"86\":{\"check\":false},\"87\":{\"check\":true},\"88\":{\"check\":true},\"89\":{\"check\":true},\"90\":{\"check\":true},\"91\":{\"check\":true},\"92\":{\"check\":true},\"93\":{\"check\":true},\"94\":{\"check\":false},\"95\":{\"check\":true},\"96\":{\"check\":false},\"97\":{\"check\":false},\"98\":{\"check\":true},\"99\":{\"check\":false},\"100\":{\"check\":true},\"101\":{\"check\":false}}}",
        A2024SI: "{\"navigation\":1,\"userdata\":{\"1\":{\"check\":true},\"2\":{\"check\":true},\"3\":{\"check\":true},\"4\":{\"check\":true},\"5\":{\"check\":true},\"6\":{\"check\":true},\"7\":{\"check\":true},\"8\":{\"check\":false},\"9\":{\"check\":false},\"10\":{\"check\":false},\"11\":{\"check\":true},\"12\":{\"check\":false},\"13\":{\"check\":false},\"14\":{\"check\":true},\"15\":{\"check\":true},\"16\":{\"check\":false},\"17\":{\"check\":false},\"18\":{\"check\":false},\"19\":{\"check\":false},\"20\":{\"check\":true},\"21\":{\"check\":false},\"22\":{\"check\":false},\"23\":{\"check\":false},\"24\":{\"check\":false},\"25\":{\"check\":false},\"26\":{\"check\":true},\"27\":{\"check\":true},\"28\":{\"check\":false},\"29\":{\"check\":true},\"30\":{\"check\":false},\"31\":{\"check\":false},\"32\":{\"check\":false},\"33\":{\"check\":true},\"34\":{\"check\":true},\"35\":{\"check\":true},\"36\":{\"check\":false},\"37\":{\"check\":false},\"38\":{\"check\":false},\"39\":{\"check\":true},\"40\":{\"check\":true},\"41\":{\"check\":true},\"42\":{\"check\":true},\"43\":{\"check\":true},\"44\":{\"check\":false},\"45\":{\"check\":false},\"46\":{\"check\":false},\"47\":{\"check\":false},\"48\":{\"check\":false},\"49\":{\"check\":false},\"50\":{\"check\":true},\"51\":{\"check\":false},\"52\":{\"check\":false},\"53\":{\"check\":true},\"54\":{\"check\":false},\"55\":{\"check\":false},\"56\":{\"check\":false},\"57\":{\"check\":false},\"58\":{\"check\":false},\"59\":{\"check\":true},\"60\":{\"check\":false},\"61\":{\"check\":false},\"62\":{\"check\":false},\"63\":{\"check\":false},\"64\":{\"check\":true},\"65\":{\"check\":true},\"66\":{\"check\":true},\"67\":{\"check\":false},\"68\":{\"check\":false},\"69\":{\"check\":false},\"70\":{\"check\":false},\"71\":{\"check\":true},\"72\":{\"check\":false},\"73\":{\"check\":false},\"74\":{\"check\":true},\"75\":{\"check\":false},\"76\":{\"check\":false},\"77\":{\"check\":true},\"78\":{\"check\":true},\"79\":{\"check\":false},\"80\":{\"check\":false},\"81\":{\"check\":false},\"82\":{\"check\":false},\"83\":{\"check\":false},\"84\":{\"check\":true},\"85\":{\"check\":false},\"86\":{\"check\":false},\"87\":{\"check\":false},\"88\":{\"check\":false},\"89\":{\"check\":false},\"90\":{\"check\":false},\"91\":{\"check\":false},\"92\":{\"check\":false},\"93\":{\"check\":false},\"94\":{\"check\":true},\"95\":{\"check\":false},\"96\":{\"check\":true},\"97\":{\"check\":false},\"98\":{\"check\":false},\"99\":{\"check\":true},\"100\":{\"check\":false},\"101\":{\"check\":false}}}",
        A2024SPA: "{\"navigation\":1,\"userdata\":{\"1\":{\"check\":true},\"2\":{\"check\":true},\"3\":{\"check\":true},\"4\":{\"check\":true},\"5\":{\"check\":true},\"6\":{\"check\":false},\"7\":{\"check\":false},\"8\":{\"check\":true},\"9\":{\"check\":true},\"10\":{\"check\":false},\"11\":{\"check\":true},\"12\":{\"check\":false},\"13\":{\"check\":false},\"14\":{\"check\":true},\"15\":{\"check\":true},\"16\":{\"check\":false},\"17\":{\"check\":true},\"18\":{\"check\":true},\"19\":{\"check\":false},\"20\":{\"check\":true},\"21\":{\"check\":true},\"22\":{\"check\":true},\"23\":{\"check\":true},\"24\":{\"check\":false},\"25\":{\"check\":true},\"26\":{\"check\":false},\"27\":{\"check\":false},\"28\":{\"check\":false},\"29\":{\"check\":false},\"30\":{\"check\":true},\"31\":{\"check\":false},\"32\":{\"check\":false},\"33\":{\"check\":true},\"34\":{\"check\":true},\"35\":{\"check\":false},\"36\":{\"check\":false},\"37\":{\"check\":true},\"38\":{\"check\":false},\"39\":{\"check\":true},\"40\":{\"check\":true},\"41\":{\"check\":true},\"42\":{\"check\":true},\"43\":{\"check\":false},\"44\":{\"check\":true},\"45\":{\"check\":true},\"46\":{\"check\":true},\"47\":{\"check\":true},\"48\":{\"check\":true},\"49\":{\"check\":true},\"50\":{\"check\":false},\"51\":{\"check\":true},\"52\":{\"check\":true},\"53\":{\"check\":false},\"54\":{\"check\":true},\"55\":{\"check\":true},\"56\":{\"check\":true},\"57\":{\"check\":false},\"58\":{\"check\":false},\"59\":{\"check\":false},\"60\":{\"check\":true},\"61\":{\"check\":true},\"62\":{\"check\":true},\"63\":{\"check\":false},\"64\":{\"check\":false},\"65\":{\"check\":true},\"66\":{\"check\":true},\"67\":{\"check\":true},\"68\":{\"check\":false},\"69\":{\"check\":true},\"70\":{\"check\":false},\"71\":{\"check\":false},\"72\":{\"check\":false},\"73\":{\"check\":false},\"74\":{\"check\":true},\"75\":{\"check\":true},\"76\":{\"check\":false},\"77\":{\"check\":false},\"78\":{\"check\":false},\"79\":{\"check\":true},\"80\":{\"check\":false},\"81\":{\"check\":false},\"82\":{\"check\":true},\"83\":{\"check\":false},\"84\":{\"check\":false},\"85\":{\"check\":true},\"86\":{\"check\":false},\"87\":{\"check\":true},\"88\":{\"check\":true},\"89\":{\"check\":true},\"90\":{\"check\":true},\"91\":{\"check\":true},\"92\":{\"check\":true},\"93\":{\"check\":true},\"94\":{\"check\":false},\"95\":{\"check\":true},\"96\":{\"check\":false},\"97\":{\"check\":false},\"98\":{\"check\":false},\"99\":{\"check\":false},\"100\":{\"check\":true},\"101\":{\"check\":false}}}",
        A2024SA: "{\"navigation\":1,\"userdata\":{\"1\":{\"check\":true},\"2\":{\"check\":true},\"3\":{\"check\":true},\"4\":{\"check\":true},\"5\":{\"check\":true},\"6\":{\"check\":false},\"7\":{\"check\":false},\"8\":{\"check\":true},\"9\":{\"check\":true},\"10\":{\"check\":false},\"11\":{\"check\":false},\"12\":{\"check\":true},\"13\":{\"check\":false},\"14\":{\"check\":true},\"15\":{\"check\":true},\"16\":{\"check\":true},\"17\":{\"check\":true},\"18\":{\"check\":true},\"19\":{\"check\":false},\"20\":{\"check\":true},\"21\":{\"check\":true},\"22\":{\"check\":true},\"23\":{\"check\":true},\"24\":{\"check\":true},\"25\":{\"check\":false},\"26\":{\"check\":false},\"27\":{\"check\":false},\"28\":{\"check\":true},\"29\":{\"check\":false},\"30\":{\"check\":false},\"31\":{\"check\":true},\"32\":{\"check\":false},\"33\":{\"check\":true},\"34\":{\"check\":false},\"35\":{\"check\":false},\"36\":{\"check\":false},\"37\":{\"check\":false},\"38\":{\"check\":true},\"39\":{\"check\":true},\"40\":{\"check\":true},\"41\":{\"check\":true},\"42\":{\"check\":true},\"43\":{\"check\":false},\"44\":{\"check\":true},\"45\":{\"check\":true},\"46\":{\"check\":true},\"47\":{\"check\":true},\"48\":{\"check\":true},\"49\":{\"check\":true},\"50\":{\"check\":false},\"51\":{\"check\":true},\"52\":{\"check\":true},\"53\":{\"check\":false},\"54\":{\"check\":true},\"55\":{\"check\":true},\"56\":{\"check\":true},\"57\":{\"check\":false},\"58\":{\"check\":true},\"59\":{\"check\":false},\"60\":{\"check\":true},\"61\":{\"check\":true},\"62\":{\"check\":true},\"63\":{\"check\":false},\"64\":{\"check\":false},\"65\":{\"check\":true},\"66\":{\"check\":true},\"67\":{\"check\":true},\"68\":{\"check\":false},\"69\":{\"check\":true},\"70\":{\"check\":false},\"71\":{\"check\":false},\"72\":{\"check\":false},\"73\":{\"check\":false},\"74\":{\"check\":true},\"75\":{\"check\":true},\"76\":{\"check\":false},\"77\":{\"check\":false},\"78\":{\"check\":false},\"79\":{\"check\":true},\"80\":{\"check\":false},\"81\":{\"check\":false},\"82\":{\"check\":true},\"83\":{\"check\":false},\"84\":{\"check\":false},\"85\":{\"check\":true},\"86\":{\"check\":false},\"87\":{\"check\":true},\"88\":{\"check\":true},\"89\":{\"check\":true},\"90\":{\"check\":true},\"91\":{\"check\":true},\"92\":{\"check\":true},\"93\":{\"check\":true},\"94\":{\"check\":false},\"95\":{\"check\":true},\"96\":{\"check\":false},\"97\":{\"check\":false},\"98\":{\"check\":false},\"99\":{\"check\":false},\"100\":{\"check\":true},\"101\":{\"check\":false}}}",
      },
      creating: false,
      finished: false,
      guardianName: null,
      childrenNames: [],
    }
  },

  methods: {
    clicked(opc) {
      let id = opc.id
      
      let isSibling = this.userdata[id].sibling
      

      if(isSibling){
        this.userdata[isSibling].check = false
      }
      
      if(opc.issolo){
        let primary = opc.primary
        let secondary = opc.secondary
        this.acuerdooptions.filter((item)=>{
          if(item.primary == primary && item.secondary == secondary && item.id != id){
            return item 
          }
        }).forEach(item => {
          this.userdata[item.id].sibling = id
          this.userdata[item.id].check = false
        });
      }

      this.userdata[id].check = !this.userdata[id].check

      this.save("clicked")
    },
    imgname(d, s, o){
      return 'app/img/op/'+d+'_'+s+'_'+o+'.jpg'
    },
    startUserData (preloadData) {
      if(preloadData){
        this.userdata = preloadData
      } else {
        for(var i in this.acuerdooptions){
          let opt = this.acuerdooptions[i]
          this.userdata[opt.id] = {
            check: false,
            //data: {...opt}
          }
        }
      }
    },
    save (state, filepdf) {
      var _this = this
      const message = {
        state: state,
        data: JSON.stringify({
          navigation: this.navigation,
          userdata: JSON.parse(JSON.stringify(this.userdata))
        }),
        siteheight: Math.round(document.getElementById('mainWrapperContent').getBoundingClientRect().height)+250
      };
      if(filepdf){
        message.pdfBase64 = filepdf
      }
      if(state=='finished'){
        message.date = new Date()
        message.dateText = _this.finalDate()
      }
      window.parent.postMessage(message, '*');
    },
    receiveData(event){
      const { data: message } = event;
      if (message?.state=='load') {
        this.loading = true
        if(message?.data){
          let thedata = JSON.parse(message.data)
          this.userdata = thedata.userdata
          this.navigation = thedata.navigation
        }
        if(message.users){
          let thenames = message.users.split('|')
          this.guardianName = thenames.length ? thenames[0] : '-'
          thenames.shift()
          this.childrenNames = thenames.length ? thenames : []
        }
        setTimeout(()=>{
          this.loading = false
          this.save('loadedFromData')
        }, 2000)
      }
      if (message?.state=='template') {
        this.loading = true
        if(message?.id){
          let thedata = JSON.parse(this.loadTemplate[message.id])
          this.userdata = thedata.userdata
        }
        if(message.users){
          let thenames = message.users.split('|')
          this.guardianName = thenames.length ? thenames[0] : '-'
          thenames.shift()
          this.childrenNames = thenames.length ? thenames : []
        }
        this.navigation = 1
        setTimeout(()=>{
          this.loading = false
          this.save('loadedTemplate')
        }, 2000)
      }
    },
    finalDate() {
      const fecha = new Date()
      const meses = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const dia = fecha.getDate();
      const mes = meses[fecha.getMonth()];
      const año = fecha.getFullYear();
      return `${dia} de ${mes} de ${año}`;
  },
    
    navigate(event){
      this.navigation = event
      setTimeout(()=>{
        this.save('navigated')
      },200)
        
    },
    imgname(primaryId, imgId) {
      return 'app/img/op/' + primaryId + '/i' + imgId + '.jpg';
    },
    
    
    getSecondaryOptionsChecked(primaryId, secondaryId) {
      let alloptions = this.acuerdooptions.filter(option => option.primary === primaryId && option.secondary === secondaryId);
      for(var i in alloptions){
        alloptions[i].check = this.userdata[alloptions[i].id].check
      }

      return alloptions.filter(option=>option.check)
    },

    endAcuerdoFamiliar () {
      var _this = this
      var element = document.getElementById('tuacuerdofamiliar');

      var opt = {
        margin:       1,
        filename:     'acuerdo-familiar.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' },
        pagebreak: { avoid: '.primaryObj', after: '.frontPage'}
      };
      _this.creating = true
      // New Promise-based usage:
      html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')  // Esto obtiene el objeto de jsPDF antes de convertirlo a base64
      .then(function(pdf) {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(9);
          pdf.setTextColor(150);
          pdf.text(`${i} de ${totalPages}`, pdf.internal.pageSize.getWidth() / 2.3, pdf.internal.pageSize.getHeight() - 0.8);
        }
      })
      .output('datauristring')  // Convierte el PDF numerado a base64
      .then(function(pdfBase64) {
        _this.save("finished", pdfBase64);
        _this.finished = true;

        setTimeout(() => {
          document.querySelector('#finishedlegend').scrollIntoView({
            behavior: 'smooth', // Efecto de desplazamiento suave
            block: 'start',     // Alinea el elemento objetivo en la parte superior del contenedor
            inline: 'nearest'   // Alineación horizontal, si es necesario
          });
        }, 500);
      })
      //.save(); // downlod pdf



    },
  },
  components: {
    'acuerdo-comp': AcuerdoComp,
    'navi-comp': NaviComp
  },
  mounted () {
    this.startUserData()
    window.addEventListener('message', (event)=>{
      this.receiveData(event)
      /* TESTING */
      /*
      setTimeout(()=>{
        let thedata = JSON.parse(this.loadTemplate['A2024SG'])
        this.userdata = thedata.userdata
        this.navigation = 16
        console.log('testing')
      }, 1000)
      */
    }, false);


    new SimpleBar(document.getElementsByTagName('main')[0], { autoHide: false });
    setTimeout(()=>{
      this.save('ready')
    }, 200)

  }
});


app.mount('#app');
