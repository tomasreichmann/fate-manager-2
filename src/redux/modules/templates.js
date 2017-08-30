import { Map, fromJS } from 'immutable';

export default Map({
  list: Map(fromJS( {
    'VS-P': {
      name: 'Vesmírná Sága - postava',
      key: 'VS-P',
      aspects: {
        types: [
          {
            label: 'Main',
            value: 'main',
          },
          {
            label: 'Trouble',
            value: 'trouble',
          },
          {
            label: 'Other',
            value: 'other',
          },
        ]
      },
      skills: {
        atletika: {
          key: 'atletika',
          name: 'Atletika',
          description: 'házení věcí, úhyb',
        },
        zlodejstvi: {
          key: 'zlodejstvi',
          name: 'Zlodějství',
          description: 'např. vypáčení zámku, vykrádání kapes',
        },
        konexe: {
          key: 'konexe',
          name: 'Konexe',
          description: 'např. sehnat nocleh na jednu noc, informace, apod.',
        },
        remeslo: {
          key: 'remeslo',
          name: 'Řemeslo',
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten, sváření',
        },
        klamani: {
          key: 'klamani',
          name: 'Klamání',
          description: 'Lhaní, padělání',
        },
        pilotovani: {
          key: 'pilotovani',
          name: 'Pilotování',
          description: 'manévrování s pilotovanou věcí, útok naražením (může dostat zranění i útočník)',
        },
        vciteni: {
          key: 'vciteni',
          name: 'Vcítění',
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění',
        },
        provokace: {
          key: 'provokace',
          name: 'Provokace',
          description: 'manipulace, vyprovokování agrese',
        },
        boj: {
          key: 'boj',
          name: 'Boj',
          description: 'veškerý fyzický boj',
        },
        vysetrovani: {
          key: 'vysetrovani',
          name: 'Vyšetřování',
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika',
        },
        veda: {
          key: 'veda',
          name: 'Věda',
          description: 'hlubší znalost fyziky, programování',
        },
        medicina: {
          key: 'medicina',
          name: 'Medicína',
          description: 'léčení, znalost anatomie, léčení fyzických následků',
        },
        technologie: {
          key: 'technologie',
          name: 'Technologie',
          description: 'Tvorba a oprava elektroniky, hackování',
        },
        vsimavost: {
          key: 'vsimavost',
          name: 'Všímavost',
          description: 'Pohotovost, schopnost zpozorovat skryté věci',
        },
        fyzickaZdatnost: {
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost',
          description: 'schopnost ustát ránu, zápasení, překonání silou',
        },
        diplomacie: {
          key: 'diplomacie',
          name: 'Diplomacie',
          description: 'vyjednávání, obchodování',
        },
        zdroje: {
          key: 'zdroje',
          name: 'Zdroje',
          description: 'schopnost získat suroviny, nebo užitečné předměty',
        },
        strelba: {
          key: 'strelba',
          name: 'Střelba',
          description: 'veškerý nekontaktní boj',
        },
        kradmost: {
          key: 'kradmost',
          name: 'Kradmost',
          description: 'Plížení, útok ze zálohy, pokládání pastí',
        },
        vule: {
          key: 'vule',
          name: 'Vůle',
          description: 'schopnost odolat psychickému útoku',
        },
        artilerie: {
          key: 'artilerie',
          name: 'Artilérie',
          description: 'používání velkých zbraní, střílení pomocí lodních systémů nebo prostřednictvím dálkového ovládání',
        },
      },
      stress: [
        {
          label: 'Fyzický stress',
          key: 'physical',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'fyzickaZdatnost',
              level: 1,
              bonus: 1
            },
            {
              skill: 'fyzickaZdatnost',
              level: 3,
              bonus: 1
            }
          ]
        },
        {
          label: 'Psychický stress',
          key: 'mental',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'vule',
              level: 1,
              bonus: 1
            },
            {
              skill: 'vule',
              level: 3,
              bonus: 1
            }
          ]
        }
      ],
      consequences: [
        {
          label: 'Mírný',
          value: 2
        },
        {
          label: 'Střední',
          value: 4
        },
        {
          label: 'Vážný',
          value: 6,
          condition: [
            {
              skill: 'fyzickaZdatnost',
              value: 5
            },
            {
              skill: 'vule',
              value: 5
            }
          ]
        },
        {
          label: 'Mírný',
          value: 2
        }
      ]
    },
    'VS-L': {
      name: 'Vesmírná Sága - loď',
      key: 'VS-L',
      aspects: {
        types: [
          {
            label: 'Main',
            value: 'main',
          },
          {
            label: 'Trouble',
            value: 'trouble',
          },
          {
            label: 'Other',
            value: 'other',
          },
        ]
      },
      skills: {
        stity: {
          key: 'stity',
          name: 'Štíty',
          description: 'redukce poškození rychle letícími částicemi',
        },
        pohon: {
          key: 'pohon',
          name: 'Pohon',
          description: 'pohon určuje maximální tažnou sílu lodi (pohon - počet zón = akcelerace)',
        },
        senzory: {
          key: 'senzory',
          name: 'Senzory',
          description: 'senzory dávají nspř. bonus k odhalení skrytých lodí, detekce žívých bytostí, apod.',
        }
      },
      stress: [
        {
          label: 'Pancíř',
          key: 'armour',
          defaultCount: 2,
          bonusConditions: []
        }
      ],
      consequences: [
        {
          label: 'Mírný',
          value: 2
        },
        {
          label: 'Střední',
          value: 4
        },
        {
          label: 'Vážný',
          value: 6
        }
      ]
    },
    'FG-P': {
      name: 'Fate Golarion - Postava',
      key: 'FG-P',
      aspects: {
        types: [
          {
            label: 'Hlavní koncept',
            value: 'main',
          },
          {
            label: 'Vztah k Zaracusovi / Arcturiusovi',
            value: 'boss',
          },
          {
            label: 'Trable',
            value: 'trouble',
          },
          {
            label: 'Další',
            value: 'other',
          },
        ]
      },
      skills: {
        alchymie: {
          key: 'alchymie',
          name: 'Alchymie',
          description: 'schopnost poznávat a vyrábět lektvary, výbušniny'
        },
        atletika: {
          key: 'atletika',
          name: 'Atletika',
          description: 'házení věcí, úhyb, tanec'
        },
        boj: {
          key: 'boj',
          name: 'Boj',
          description: 'veškerý fyzický boj'
        },
        diplomacie: {
          key: 'diplomacie',
          name: 'Diplomacie',
          description: 'vyjednávání, obchodování'
        },
        fyzickaZdatnost: {
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost',
          description: 'schopnost ustát ránu, zápasení, překonání silou'
        },
        jizda: {
          key: 'jizda',
          name: 'Jízda',
          description: 'jízda na koni, řízení povozu'
        },
        klamani: {
          key: 'klamani',
          name: 'Klamání',
          description: 'lhaní, padělání'
        },
        konexe: {
          key: 'konexe',
          name: 'Konexe',
          description: 'např. sehnat nocleh na jednu noc, informace, apod.'
        },
        kradmost: {
          key: 'kradmost',
          name: 'Kradmost',
          description: 'plížení, útok ze zálohy, výroba a pokládání pastí'
        },
        leceni: {
          key: 'leceni',
          name: 'Léčení',
          description: 'léčení zranění, nemocí, jedů, znalost anatomie, léčení fyzických následků'
        },
        magie: {
          key: 'magie',
          name: 'Magie',
          description: 'schopnost porozumět a sesílat klasickou magii'
        },
        provokace: {
          key: 'provokace',
          name: 'Provokace',
          description: 'manipulace, vyprovokování agrese'
        },
        runy: {
          key: 'runy',
          name: 'Runy',
          description: 'schopnost číst a psát magické runy'
        },
        remeslo: {
          key: 'remeslo',
          name: 'Řemeslo',
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten'
        },
        spiritualismus: {
          key: 'spiritualismus',
          name: 'Spiritualismus',
          description: 'Schopnost rozumět a sesílat magii propůjčenou mýtickými bytostmi a komunikace s nimi'
        },
        strelba: {
          key: 'strelba',
          name: 'Střelba',
          description: 'veškerý nekontaktní boj'
        },
        vciteni: {
          key: 'vciteni',
          name: 'Vcítění',
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění'
        },
        svetoznalost: {
          key: 'svetoznalost',
          name: 'Světoznalost',
          description: 'Znalost historie, zeměpisu, kultury, jazyků'
        },
        vsimavost: {
          key: 'vsimavost',
          name: 'Všímavost',
          description: 'Pohotovost, schopnost zpozorovat skryté věci'
        },
        vule: {
          key: 'vule',
          name: 'Vůle',
          description: 'schopnost odolat psychickému útoku'
        },
        vysetrovani: {
          key: 'vysetrovani',
          name: 'Vyšetřování',
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika'
        },
        zdroje: {
          key: 'zdroje',
          name: 'Zdroje',
          description: 'schopnost získat suroviny, nebo užitečné předměty'
        },
        zlodejstvi: {
          key: 'zlodejstvi',
          name: 'Zlodějství',
          description: 'např. vypáčení zámku, vykrádání kapes'
        },
      },
      stress: [
        {
          label: 'Fyzický stress',
          key: 'physical',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'fyzickaZdatnost',
              level: 1,
              bonus: 1
            },
            {
              skill: 'fyzickaZdatnost',
              level: 3,
              bonus: 1
            }
          ]
        },
        {
          label: 'Psychický stress',
          key: 'mental',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'vule',
              level: 1,
              bonus: 1
            },
            {
              skill: 'vule',
              level: 3,
              bonus: 1
            }
          ]
        }
      ],
      consequences: [
        {
          label: 'Mírný',
          value: 2
        },
        {
          label: 'Střední',
          value: 4
        },
        {
          label: 'Vážný',
          value: 6,
          condition: [
            {
              skill: 'fyzickaZdatnost',
              value: 5
            },
            {
              skill: 'vule',
              value: 5
            }
          ]
        }
      ]
    }
  }))
});
