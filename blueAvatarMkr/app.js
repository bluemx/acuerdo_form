



var colorSkin = '#d5af8d'
var colorHair = '#5b3a1a'
var colorClothes = '#1694c2'









const { createApp } = Vue;

createApp({
    data() {
        return {
            sections: [           // Secciones del menú
                {id:1, label: 'Hair', icon: 'mingcute:hair-fill',  },
                {id:2, label: 'Face', icon: 'mingcute:face-line',  },
                {id:3, label: 'Eyes', icon: 'mingcute:eye-fill',  },
                {id:4, label: 'Eyebrows', icon: 'mingcute:eyebrow-fill',  },
                {id:5, label: 'Mouth', icon: 'mingcute:mouth-line',  },
                {id:6, label: 'Clothes', icon: 'mingcute:t-shirt-line',  }
            ],
            activeSection: null,
            items: {
                hairF: hairfrontDB,
                hairB: hairBackDB,
                eyebrows: eyebrowsDB,
                eyes: eyesDB,
                mouth: noseMouthDB,
                head: headDB,
                body: bodyDB,
            },
            actives: {
              hbf: 1,
              e: 1,
              eb: 1,
              m: 1,
              h: 0,
              b: 0,
              color: {
                skin: '#d5af8d',
                hair: '#5b3a1a',
                clothes: '#1694c2'
              }
            },
            draw: null
        };
    },
    methods: {
      changeAvatar(attr, index) {
        this.actives[attr] = index
        this.draw.clear()
        setTimeout(()=>{
          this.avatarChanger()
        }, 100)
      },
      cleanShapes(item) {
        //return item.replace(/fill="[^"]*"/g, "").replace(/stroke="[^"]*"/g, "");
        return item
      },
      darkenColor(color, percent) {
          color = color.replace(/^\s*#|\s*$/g, "");
          if (color.length == 3) { color = color.replace(/(.)/g, "$1$1"); }
          const hexR = color.substring(0, 2);
          const hexG = color.substring(2, 4);
          const hexB = color.substring(4, 6);
          let r = parseInt(hexR, 16);
          let g = parseInt(hexG, 16);
          let b = parseInt(hexB, 16);
          if (isNaN(r)) r = 0;
          if (isNaN(g)) g = 0;
          if (isNaN(b)) b = 0;
          const newR = Math.min(255, Math.floor(r + (r * percent) / 100));
          const newG = Math.min(255, Math.floor(g + (g * percent) / 100));
          const newB = Math.min(255, Math.floor(b + (b * percent) / 100));
          const newHexRColor = `${newR.toString(16)}`.padStart(2, "0");
          const newHexGColor = `${newG.toString(16)}`.padStart(2, "0");
          const newHexBColor = `${newB.toString(16)}`.padStart(2, "0");
          return "#" + newHexRColor + newHexGColor + newHexBColor;
        },
      avatarChanger () {
          
          
          //Load hairBack
          const hairBackG = this.draw.group();
          hairBackG.svg(this.cleanShapes(hairBackDB[this.actives.hbf]));
          //Draw Neck
          const neckG = this.draw.group();
          neckG.line(200, 340, 200, 300).stroke({ width: 48, linecap: 'round' })
          //Load body
          const bodyG = this.draw.group();
          bodyG.svg(this.cleanShapes(bodyDB[this.actives.b]));
          //Load head
          const headG = this.draw.group();
          headG.svg(this.cleanShapes(headDB[this.actives.h]));
          //Load Eyes
          const eyesG = this.draw.group();
          eyesG.svg(eyesDB[this.actives.e]);
        
          // Create blinker
          let blinker = this.draw.rect(160, 100).move(120, 140)
          blinker.animate({
            duration: 400,
            when:'now',
            times: 99,
            wait: 2000
          }).attr({ height: 0 })
          //Load noseMouth
          const noseMouthG = this.draw.group();
          noseMouthG.svg(noseMouthDB[this.actives.m]);
        // Load Eyebrows
        const eyebrowsG = this.draw.group();
        eyebrowsG.svg(this.cleanShapes(eyebrowsDB[this.actives.eb]));
        let eyebrowRunner = eyebrowsG.animate(400,400, 'now')
            .dmove(0, -6)
            .animate(400, 400)
            .dmove(0, 6);
        eyebrowRunner.loop(99, true, 5000)
        
          //Load HairFront
          const hairFrontG = this.draw.group();
          hairFrontG.svg(this.cleanShapes(hairfrontDB[this.actives.hbf]));
        
          //Set Colors
          hairBackG.fill(colorHair);
          neckG.stroke(this.darkenColor(colorSkin,-10));
          bodyG.fill(colorClothes);
          headG.fill(colorSkin);
          eyebrowsG.stroke(this.darkenColor(colorHair, 40));
          hairFrontG.fill(colorHair);
          blinker.fill(colorSkin);
        
      }
    },
    mounted() {
        // Inicializa con la primera sección como activa
        var _this = this
        this.activeSection = this.sections[0];
        SVG.on(document, "DOMContentLoaded", function () {
          _this.draw = SVG().addTo("#appsvg").size("100%", "100%");
          _this.avatarChanger()
        });
    }
}).mount('#app');