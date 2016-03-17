# Installation

`npm install`

# Development server

`npm start` 

# Build dist

`npm run build`

# Usage

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
      value: 1,
      satellites: [
        {
          label: 'Moon1',
          value: 1
        },
        {
          label: 'Moon2',
          value: 3
        },
        {
          label: 'Moon3',
          value: 6
        },
        {
          label: 'Moon4',
          value: 10
        }
      ]
    },
    {
      label: 'Sat2',
      value: 3,
      satellites: [
        {
          label: 'Moon5',
          value: 1
        },
        {
          label: 'Moon6',
          value: 5
        },
        {
          label: 'Moon7',
          value: 10
        }
      ]
    },
    {
      label: 'Sat3',
      value: 8,
      satellites: [
        {
          label: 'Moon8',
          value: 1
        },
        {
          label: 'Moon9',
          value: 3
        },
        {
          label: 'Moon10',
          value: 6
        },
        {
          label: 'Moon11',
          value: 10
        },
        {
          label: 'Moon12',
          value: 2
        },
        {
          label: 'Moon13',
          value: 4
        },
        {
          label: 'Moon14',
          value: 7
        },
        {
          label: 'Moon15',
          value: 9
        }
      ]
    },
    {
      label: 'Sat4',
      value: 10,
      satellites: [
        {
          label: 'Moon16',
          value: 1
        },
        {
          label: 'Moon17',
          value: 5
        },
        {
          label: 'Moon18',
          value: 10
        }

      ]
    }
  ]
};
```