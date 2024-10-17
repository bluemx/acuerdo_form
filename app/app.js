// Componente contador básico con props



const AcuerdoComp = {
  props: {
    data: Object,
    options: Object,
    userdata: Object
  },
  template: `
    <div class="acuerdocomp  flex flex-col gap-1 md:gap-4 m-0 md:m-5">
      <h2 class="font-bold text-dfgray text-base md:text-xl"><span class="opacity-50 text-xl md:text-2xl">{{data.id}}.</span> {{data.texto}}</h2>
      <div v-for="(sec, sindex) in data.secundarios" class="m-1 md:m-5">
        <h3 class="text-dfgray text-base md:text-2xl">{{sec.texto}}</h3>
        <div class="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-5 lg:gap-5 xl:gap-10 my-5"> 
            <!-- option -->
              <div v-for="(opc, oindex) in getOptions(sec.id)" class="flex flex-col cursor-pointer" @click="handleClick(opc.id)">
                <!--img -->
                <div class="aspect-square   w-10/12 rounded-xl mx-auto z-10 relative flex justify-center items-center max-w-40 transition-all duration-500 bg-dfgray">
                    <div class="bg-dfgray absolute inset-0 rounded-xl dfgradient transition-all duration-500" :class="isChecked(opc.id)?'opacity-100':'opacity-0'"></div>
                    <div class="border-4 border-white w-6 aspect-square rounded-full absolute top-1 right-1 flex justify-center items-center z-20 transition-all " :class="isChecked(opc.id)?'bg-white shadow-md w-10 duration-200':'shadow-xs bg-white/50 duration-1000'">
                      <img src="app/img/check.svg" class="w-4/5" :class="isChecked(opc.id)?'opacity-100 duration-500':'opacity-0 duration-1000'">
                    </div>
                    <div class="optionimage w-11/12 aspect-square bg-white">
                          <img :src="imgname(opc.id)" class="transition-all duration-300" :class="isChecked(opc.id)?'':'grayscale blur-sm'">
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
      </div>
    </div>
  `,
  methods: {
    imgname(imgId) {
      const primaryId = this.data.id;
      return 'app/img/op/' + primaryId + '/i' + imgId + '.jpg';
    },
    getOptions(secondaryId) {
      const primaryId = this.data.id;
      return this.options.filter(option => option.primary === primaryId && option.secondary === secondaryId);
    },
    handleClick(id) {
      this.$emit('clicked', id);
    },
    isChecked(id) {
      return !!this.userdata[id]?.check;
    }
  }
}





const app = Vue.createApp({
  data (){
    return {
      acuerdodata: dataAcuerdo,
      acuerdooptions: dataAcuerdoOptions,
      userdata: {},
      navigation: 0,
      loading: false
    }
  },

  methods: {
    clicked(id) {
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
    save (state) {
      const message = {
        state: state,
        navigation: this.navigation,
        userdata: JSON.parse(JSON.stringify(this.userdata)),
      };
      window.parent.postMessage(message, '*');
    },
    receiveData(event){
      const { data: message } = event;
      if (message?.navigation && message?.userdata) {
        this.loading = true
        this.userdata = message.userdata
        setTimeout(()=>{
          this.loading = false
        }, 2000)
      }
    }
  },
  components: {
    'acuerdo-comp': AcuerdoComp
  },
  mounted () {
    this.startUserData()


    window.addEventListener('message', (event)=>{
      this.receiveData(event)
    }, false);

  }
});


app.mount('#app');
