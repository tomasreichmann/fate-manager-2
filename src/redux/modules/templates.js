import { Map, fromJS } from 'immutable';

export default Map({
  list: Map(fromJS({
    'FG-P': {
      aspects: {
        types: [
          {
            label: 'Hlavní koncept',
            value: 'main'
          },
          {
            label: 'Vztah k Zaracusovi / Arcturiusovi',
            value: 'boss'
          },
          {
            label: 'Trable',
            value: 'trouble'
          },
          {
            label: 'Další',
            value: 'other'
          }
        ]
      },
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
          condition: [
            {
              skill: 'fyzickaZdatnost',
              value: 5
            },
            {
              skill: 'vule',
              value: 5
            }
          ],
          label: 'Vážný',
          value: 6
        }
      ],
      key: 'FG-P',
      name: 'Fate Golarion - Postava',
      skills: {
        alchymie: {
          description: 'schopnost poznávat a vyrábět lektvary, výbušniny',
          key: 'alchymie',
          name: 'Alchymie'
        },
        atletika: {
          description: 'házení věcí, úhyb, tanec',
          key: 'atletika',
          name: 'Atletika'
        },
        boj: {
          description: 'veškerý fyzický boj',
          key: 'boj',
          name: 'Boj'
        },
        diplomacie: {
          description: 'vyjednávání, obchodování',
          key: 'diplomacie',
          name: 'Diplomacie'
        },
        fyzickaZdatnost: {
          description: 'schopnost ustát ránu, zápasení, překonání silou',
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost'
        },
        jizda: {
          description: 'jízda na koni, řízení povozu',
          key: 'jizda',
          name: 'Jízda'
        },
        klamani: {
          description: 'lhaní, padělání',
          key: 'klamani',
          name: 'Klamání'
        },
        konexe: {
          description: 'např. sehnat nocleh na jednu noc, informace, apod.',
          key: 'konexe',
          name: 'Konexe'
        },
        kradmost: {
          description: 'plížení, útok ze zálohy, výroba a pokládání pastí',
          key: 'kradmost',
          name: 'Kradmost'
        },
        leceni: {
          description: 'léčení zranění, nemocí, jedů, znalost anatomie, léčení fyzických následků',
          key: 'leceni',
          name: 'Léčení'
        },
        magie: {
          description: 'schopnost porozumět a sesílat klasickou magii',
          key: 'magie',
          name: 'Magie'
        },
        provokace: {
          description: 'manipulace, vyprovokování agrese',
          key: 'provokace',
          name: 'Provokace'
        },
        remeslo: {
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten',
          key: 'remeslo',
          name: 'Řemeslo'
        },
        runy: {
          description: 'schopnost číst a psát magické runy',
          key: 'runy',
          name: 'Runy'
        },
        spiritualismus: {
          description: 'Schopnost rozumět a sesílat magii propůjčenou mýtickými bytostmi a komunikace s nimi',
          key: 'spiritualismus',
          name: 'Spiritualismus'
        },
        strelba: {
          description: 'veškerý nekontaktní boj',
          key: 'strelba',
          name: 'Střelba'
        },
        svetoznalost: {
          description: 'Znalost historie, zeměpisu, kultury, jazyků',
          key: 'svetoznalost',
          name: 'Světoznalost'
        },
        vciteni: {
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění',
          key: 'vciteni',
          name: 'Vcítění'
        },
        vsimavost: {
          description: 'Pohotovost, schopnost zpozorovat skryté věci',
          key: 'vsimavost',
          name: 'Všímavost'
        },
        vule: {
          description: 'schopnost odolat psychickému útoku',
          key: 'vule',
          name: 'Vůle'
        },
        vysetrovani: {
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika',
          key: 'vysetrovani',
          name: 'Vyšetřování'
        },
        zdroje: {
          description: 'schopnost získat suroviny, nebo užitečné předměty',
          key: 'zdroje',
          name: 'Zdroje'
        },
        zlodejstvi: {
          description: 'např. vypáčení zámku, vykrádání kapes',
          key: 'zlodejstvi',
          name: 'Zlodějství'
        }
      },
      stress: [
        {
          bonusConditions: [
            {
              bonus: 1,
              level: 1,
              skill: 'fyzickaZdatnost'
            },
            {
              bonus: 1,
              level: 3,
              skill: 'fyzickaZdatnost'
            }
          ],
          defaultCount: 2,
          key: 'physical',
          label: 'Fyzický stress'
        },
        {
          bonusConditions: [
            {
              bonus: 1,
              level: 1,
              skill: 'vule'
            },
            {
              bonus: 1,
              level: 3,
              skill: 'vule'
            }
          ],
          defaultCount: 2,
          key: 'mental',
          label: 'Psychický stress'
        }
      ]
    },
    'SB-P': {
      aspects: {
        types: [
          {
            label: 'Vyšší koncept',
            value: 'main'
          },
          {
            label: 'Osud',
            value: 'fate'
          },
          {
            label: 'Trable',
            value: 'trouble'
          },
          {
            label: 'Oběť',
            value: 'sacrifice'
          }
        ]
      },
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
        },
        {
          label: 'Mírný',
          value: 2
        }
      ],
      key: 'SB-P',
      name: 'Straw boss - postava',
      skills: {
        artilerie: {
          description: 'používání velkých zbraní, střílení pomocí lodních systémů nebo prostřednictvím dálkového ovládání',
          key: 'artilerie',
          name: 'Artilérie'
        },
        atletika: {
          description: 'házení věcí, úhyb',
          key: 'atletika',
          name: 'Atletika'
        },
        boj: {
          description: 'veškerý fyzický boj',
          key: 'boj',
          name: 'Boj'
        },
        demonologie: {
          description: 'např. získání informací o démonech',
          key: 'demonologie',
          name: 'Demonologie'
        },
        diplomacie: {
          description: 'vyjednávání, obchodování',
          key: 'diplomacie',
          name: 'Diplomacie'
        },
        fyzickaZdatnost: {
          description: 'schopnost ustát ránu, zápasení, překonání silou',
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost'
        },
        klamani: {
          description: 'Lhaní, padělání',
          key: 'klamani',
          name: 'Klamání'
        },
        konexe: {
          description: 'např. sehnat nocleh na jednu noc, informace, apod.',
          key: 'konexe',
          name: 'Konexe'
        },
        kontrola: {
          description: 'Schopnost odolávat zkáze',
          key: 'kontrola',
          name: 'Kontrola'
        },
        kradmost: {
          description: 'Plížení, útok ze zálohy, pokládání pastí',
          key: 'kradmost',
          name: 'Kradmost'
        },
        media: {
          description: 'např. vyhlevání na internetu, hackování',
          key: 'media',
          name: 'Média'
        },
        magie: {
          description: 'např. kouzlení na cokoliv co neni démon',
          key: 'magie',
          name: 'Magie'
        },
        medicina: {
          description: 'léčení, znalost anatomie, léčení fyzických následků',
          key: 'medicina',
          name: 'Medicína'
        },
        pilotovani: {
          description: 'manévrování s pilotovanou věcí, útok naražením (může dostat zranění i útočník)',
          key: 'pilotovani',
          name: 'Pilotování'
        },
        provokace: {
          description: 'manipulace, vyprovokování agrese',
          key: 'provokace',
          name: 'Provokace'
        },
        remeslo: {
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten, sváření',
          key: 'remeslo',
          name: 'Řemeslo'
        },
        strelba: {
          description: 'veškerý nekontaktní boj',
          key: 'strelba',
          name: 'Střelba'
        },
        technologie: {
          description: 'Tvorba a oprava elektroniky',
          key: 'technologie',
          name: 'Technologie'
        },
        vciteni: {
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění',
          key: 'vciteni',
          name: 'Vcítění'
        },
        veda: {
          description: 'hlubší znalost fyziky, programování',
          key: 'veda',
          name: 'Věda'
        },
        vsimavost: {
          description: 'Pohotovost, schopnost zpozorovat skryté věci',
          key: 'vsimavost',
          name: 'Všímavost'
        },
        vule: {
          description: 'schopnost odolat psychickému útoku',
          key: 'vule',
          name: 'Vůle'
        },
        vysetrovani: {
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika',
          key: 'vysetrovani',
          name: 'Vyšetřování'
        },
        zdroje: {
          description: 'schopnost získat suroviny, nebo užitečné předměty',
          key: 'zdroje',
          name: 'Zdroje'
        },
        zlodejstvi: {
          description: 'např. vypáčení zámku, vykrádání kapes',
          key: 'zlodejstvi',
          name: 'Zlodějství'
        }
      },
      stress: [
        {
          defaultCount: 2,
          key: 'physical',
          label: 'Fyzický stress'
        },
        {
          defaultCount: 2,
          key: 'mental',
          label: 'Psychický stress'
        },
        {
          defaultCount: 3,
          key: 'corruption',
          label: 'Korupce'
        }
      ]
    },
    'SB-S': {
      aspects: {
        types: [
          {
            label: 'Oblast Vlivu',
            value: 'influence'
          },
          {
            label: 'Cnost',
            value: 'virtue'
          },
          {
            label: 'Neřest',
            value: 'vice'
          }
        ]
      },
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
        },
        {
          label: 'Mírný',
          value: 2
        }
      ],
      key: 'SB-S',
      name: 'Straw boss - společník',
      skills: {
        'Chytrý': {
          description: '',
          key: 'Chytrý',
          name: 'Chytrý'
        },
        'Lstivý': {
          description: '',
          key: 'Lstivý',
          name: 'Lstivý'
        },
        'Oslnivý': {
          description: '',
          key: 'Oslnivý',
          name: 'Oslnivý'
        },
        'Pečlivý': {
          description: '',
          key: 'Pečlivý',
          name: 'Pečlivý'
        },
        'Rychlý': {
          description: '',
          key: 'Rychlý',
          name: 'Rychlý'
        },
        'Rázný': {
          description: '',
          key: 'Rázný',
          name: 'Rázný'
        }
      },
      stress: [
        {
          defaultCount: 3,
          key: 'control',
          label: 'Ovládnutí'
        }
      ]
    },
    'VS-L': {
      aspects: {
        types: [
          {
            label: 'Main',
            value: 'main'
          },
          {
            label: 'Trouble',
            value: 'trouble'
          },
          {
            label: 'Other',
            value: 'other'
          }
        ]
      },
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
        },
        {
          label: 'Mírný',
          value: 2
        }
      ],
      key: 'VS-L',
      name: 'Vesmírná Sága - loď',
      skills: {
        pohon: {
          description: 'pohon určuje maximální tažnou sílu lodi (pohon - počet zón = akcelerace)',
          key: 'pohon',
          name: 'Pohon'
        },
        senzory: {
          description: 'senzory dávají nspř. bonus k odhalení skrytých lodí, detekce žívých bytostí, apod.',
          key: 'senzory',
          name: 'Senzory'
        },
        stity: {
          description: 'redukce poškození rychle letícími částicemi',
          key: 'stity',
          name: 'Štíty'
        }
      },
      stress: [
        {
          defaultCount: 2,
          key: 'armour',
          label: 'Pancíř'
        }
      ]
    },
    'VS-P': {
      aspects: {
        types: [
          {
            label: 'Main',
            value: 'main'
          },
          {
            label: 'Trouble',
            value: 'trouble'
          },
          {
            label: 'Other',
            value: 'other'
          }
        ]
      },
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
          condition: [
            {
              skill: 'fyzickaZdatnost',
              value: 5
            },
            {
              skill: 'vule',
              value: 5
            }
          ],
          label: 'Vážný',
          value: 6
        },
        {
          label: 'Mírný',
          value: 2
        }
      ],
      key: 'VS-P',
      name: 'Vesmírná Sága - postava',
      skills: {
        artilerie: {
          description: 'používání velkých zbraní, střílení pomocí lodních systémů nebo prostřednictvím dálkového ovládání',
          key: 'artilerie',
          name: 'Artilérie'
        },
        atletika: {
          description: 'házení věcí, úhyb',
          key: 'atletika',
          name: 'Atletika'
        },
        boj: {
          description: 'veškerý fyzický boj',
          key: 'boj',
          name: 'Boj'
        },
        diplomacie: {
          description: 'vyjednávání, obchodování',
          key: 'diplomacie',
          name: 'Diplomacie'
        },
        fyzickaZdatnost: {
          description: 'schopnost ustát ránu, zápasení, překonání silou',
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost'
        },
        klamani: {
          description: 'Lhaní, padělání',
          key: 'klamani',
          name: 'Klamání'
        },
        konexe: {
          description: 'např. sehnat nocleh na jednu noc, informace, apod.',
          key: 'konexe',
          name: 'Konexe'
        },
        kradmost: {
          description: 'Plížení, útok ze zálohy, pokládání pastí',
          key: 'kradmost',
          name: 'Kradmost'
        },
        medicina: {
          description: 'léčení, znalost anatomie, léčení fyzických následků',
          key: 'medicina',
          name: 'Medicína'
        },
        pilotovani: {
          description: 'manévrování s pilotovanou věcí, útok naražením (může dostat zranění i útočník)',
          key: 'pilotovani',
          name: 'Pilotování'
        },
        provokace: {
          description: 'manipulace, vyprovokování agrese',
          key: 'provokace',
          name: 'Provokace'
        },
        remeslo: {
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten, sváření',
          key: 'remeslo',
          name: 'Řemeslo'
        },
        strelba: {
          description: 'veškerý nekontaktní boj',
          key: 'strelba',
          name: 'Střelba'
        },
        technologie: {
          description: 'Tvorba a oprava elektroniky, hackování',
          key: 'technologie',
          name: 'Technologie'
        },
        vciteni: {
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění',
          key: 'vciteni',
          name: 'Vcítění'
        },
        veda: {
          description: 'hlubší znalost fyziky, programování',
          key: 'veda',
          name: 'Věda'
        },
        vsimavost: {
          description: 'Pohotovost, schopnost zpozorovat skryté věci',
          key: 'vsimavost',
          name: 'Všímavost'
        },
        vule: {
          description: 'schopnost odolat psychickému útoku',
          key: 'vule',
          name: 'Vůle'
        },
        vysetrovani: {
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika',
          key: 'vysetrovani',
          name: 'Vyšetřování'
        },
        zdroje: {
          description: 'schopnost získat suroviny, nebo užitečné předměty',
          key: 'zdroje',
          name: 'Zdroje'
        },
        zlodejstvi: {
          description: 'např. vypáčení zámku, vykrádání kapes',
          key: 'zlodejstvi',
          name: 'Zlodějství'
        }
      },
      stress: [
        {
          bonusConditions: [
            {
              bonus: 1,
              level: 1,
              skill: 'fyzickaZdatnost'
            },
            {
              bonus: 1,
              level: 3,
              skill: 'fyzickaZdatnost'
            }
          ],
          defaultCount: 2,
          key: 'physical',
          label: 'Fyzický stress'
        },
        {
          bonusConditions: [
            {
              bonus: 1,
              level: 1,
              skill: 'vule'
            },
            {
              bonus: 1,
              level: 3,
              skill: 'vule'
            }
          ],
          defaultCount: 2,
          key: 'mental',
          label: 'Psychický stress'
        }
      ]
    },
    'Zneucteni-Postava': {
      'aspects': {
        'types': [ {
          'label': "Hlavní koncept",
          'value': "main"
        }, {
          'label': "Trable",
          'value': "trouble"
        }, {
          'label': "Další",
          'value': "other"
        } ]
      },
      'consequences': [ {
        'label': "Mírný",
        'value': 2
      }, {
        'label': "Střední",
        'value': 4
      }, {
        'label': "Vážný",
        'value': 6
      }, {
        'label': "Mírný",
        'value': 2,
        'condition': [ {
          'skill': "fyzickaZdatnost",
          'value': 5
        }, {
          'skill': "vule",
          'value': 5
        } ]
      } ],
      'key': "Zneucteni-Postava",
      'name': "Zneuctění - Postava",
      'skills': {
        'alchymie': {
          'description': "schopnost poznávat a vyrábět lektvary, výbušniny",
          'key': "alchymie",
          'name': "Alchymie"
        },
        'atletika': {
          'description': "šplh, plavání, úskok, tanec",
          'key': "atletika",
          'name': "Atletika"
        },
        'bojBezeZbrane': {
          'description': "Boj pěstmi, škrcení",
          'key': "bojBezeZbrane",
          'name': "Boj beze zbraně"
        },
        'diplomacie': {
          'description': "vyjednávání, přesvědčování, obchodování",
          'key': "diplomacie",
          'name': "Diplomacie"
        },
        'fyzickaZdatnost': {
          'description': "schopnost ustát ránu, zápasení, překonání silou",
          'key': "fyzickaZdatnost",
          'name': "Fyzická zdatnost"
        },
        'jizda': {
          'description': "jízda na koni, řízení dopravních prostředků",
          'key': "jizda",
          'name': "Jízda"
        },
        'klamani': {
          'description': "lhaní, přestrojení",
          'key': "klamani",
          'name': "Klamání"
        },
        'konexe': {
          'description': "např. sehnat nocleh na jednu noc, informace, apod.",
          'key': "konexe",
          'name': "Konexe"
        },
        'kradmost': {
          'description': "plížení, vykrádání kapes",
          'key': "kradmost",
          'name': "Kradmost"
        },
        'medicina': {
          'description': "léčení zranění, nemocí, jedů, znalost anatomie, léčení fyzických následků",
          'key': "medicina",
          'name': "Medicína"
        },
        'odemykani': {
          'description': "Odemykání zámků a safů",
          'key': "odemykani",
          'name': "Odemykání"
        },
        'padelani': {
          'description': "Padělání dokumentů, mincí, umění",
          'key': "padelani",
          'name': "Odemykání"
        },
        'pasti': {
          'description': "Pokládání a deaktivace pastí",
          'key': "pasti",
          'name': "Pasti"
        },
        'provokace': {
          'description': "manipulace, vyhrožování, vydírání",
          'key': "provokace",
          'name': "Provokace"
        },
        'remeslo': {
          'description': "Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten",
          'key': "remeslo",
          'name': "Řemeslo"
        },
        'strelbaVrhani': {
          'description': "Střelba a vrhání",
          'key': "strelbaVrhani",
          'name': "Střelba a vrhání"
        },
        'vciteni': {
          'description': "čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění",
          'key': "vciteni",
          'name': "Vcítění"
        },
        'vsimavost': {
          'description': "Pohotovost, schopnost zpozorovat skryté věci a pasti",
          'key': "vsimavost",
          'name': "Všímavost"
        },
        'vule': {
          'description': "schopnost odolat psychickému útoku",
          'key': "vule",
          'name': "Vůle"
        },
        'vzdelanost': {
          'description': "Znalost historie, zeměpisu, kultury, jazyků",
          'key': "vzdelanost",
          'name': "Světoznalost"
        },
        'zbraneNaBlízko': {
          'description': "boj na blízko se zbraněmi",
          'key': "zbraneNaBlízko",
          'name': "Zbraně na blízko"
        }
      },
      'stress': [ {
        'bonusConditions': [ {
          'bonus': 1,
          'level': 1,
          'skill': "fyzickaZdatnost"
        }, {
          'bonus': 1,
          'level': 3,
          'skill': "fyzickaZdatnost"
        } ],
        'defaultCount': 2,
        'key': "physical",
        'label': "Fyzický stress"
      }, {
        'bonusConditions': [ {
          'bonus': 1,
          'level': 1,
          'skill': "vule"
        }, {
          'bonus': 1,
          'level': 3,
          'skill': "vule"
        } ],
        'defaultCount': 2,
        'key': "mental",
        'label': "Psychický stress"
      } ]
    }
  }))
});
