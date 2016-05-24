# Satellite-chart
[photo]
# Table of Contents

* [About this module](#about-this-module)
* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Running Example](#running-example)

# About this module

At the time there was no module like this available - so we've created one.
We love simplicity! We've put much effort in making this module as slim and easy to use as possible.


# Instalation

`npm install satellite-chart`

# Basic Usage

```javascript
var satchart = new satchart.SatChart(
  document.getElementById('vis-container'),
  data,
  {
    width: 1000,
    height: 1000,
    valueRange: [1, 5.5, 10],
    colorRange: ['#fc2d2d', '#ffffff', '#2979f2'],
    strokeWidth: 0.5,
    distanceRatio: 3, // sun-to-planets / planets-to-moons
    animationDuration: 3000
  }
);
```

**data format:**

```javascript
var data = {
  label: 'A--',
  value: 9,
  satellites: [
    {
      label: 'Sat1',
      tip: 'Sat1 example',
      value: 1,
      satellites: [
        {
          label: 'Moon1',
          tip: 'example1',
          value: 1
        },
        {
          label: 'Moon2',
          tip: 'example2',
          value: 3
        },
        {
          label: 'Moon3',
          tip: 'example3',
          value: 6
        },
        {
          label: 'Moon4',
          tip: 'example4',
          value: 10
        }
      ]
    },
    {
      label: 'Sat2',
      value: 3,
      tip: 'Sat2 example',
      satellites: [
        {
          label: 'Moon5',
          tip: 'example5',
          value: 1
        },
        {
          label: 'Moon6',
          tip: 'example6',
          value: 5
        },
        {
          label: 'Moon7',
          tip: 'example7',
          value: 10
        }
      ]
    },
    {
      label: 'Sat3',
      value: 8,
      tip: 'Sat3 example',
      satellites: [
        {
          label: 'Moon8',
          tip: 'example8',
          value: 1
        },
        {
          label: 'Moon9',
          tip: 'example9',
          value: 3
        },
        {
          label: 'Moon10',
          tip: 'example10',
          value: 6
        },
        {
          label: 'Moon11',
          tip: 'example11',
          value: 10
        },
        {
          label: 'Moon12',
          tip: 'example12',
          value: 2
        },
        {
          label: 'Moon13',
          tip: 'example13',
          value: 4
        },
        {
          label: 'Moon14',
          tip: 'example14',
          value: 7
        },
        {
          label: 'Moon15',
          tip: 'example15',
          value: 9
        }
      ]
    },
    {
      label: 'Sat4',
      value: 10,
      tip: 'Sat4 example',
      satellites: [
        {
          label: 'Moon16',
          tip: 'example16',
          value: 1
        },
        {
          label: 'Moon17',
          tip: 'example17',
          value: 5
        },
        {
          label: 'Moon18',
          tip: 'example18',
          value: 10
        }

      ]
    }
  ]
};
```


# Running Example
### Install the dependencies

`npm install`

### Build dist

`npm run build`

### Development server

`npm start` 

