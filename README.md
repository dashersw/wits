# wits — A Node.js library that reads your mind with Emotiv EPOC EEG headset
![wits eeg demo](https://user-images.githubusercontent.com/698308/35773987-9a31b880-0962-11e8-9edf-b0f8df46c4d4.gif)

```js
const mind = require('wits')
mind.open()
mind.read(console.log)
```

**wits lets you monitor your brain activity. It is an interface to Emotiv EPOC headsets, and reflects what goes on in your mind.**

## Features

- Implemented as a native C module for raw performance (based on [openyou/emokit-c](https://github.com/openyou/emokit-c.git))
- Raw EEG data stream of 14 electrodes with 128Hz sample rate
- Easy-to-use, humanized API


## Installation
### External dependencies

This project depends on external libraries like hidapi and mcrypt for USB communication. If you have both hidapi and mcrypt, you can skip this step.

Install external dependencies:

```sh
brew install hidapi mcrypt
```

### Install wits

Install via npm:
```sh
npm install wits
```

## Usage
Here's a small example where we open a connection to an Emotiv EPOC headset and start reading the value of the AF3 electrode. The example pauses the data flow after 3 seconds, resumes it and finally closes the connection.

```js
const mind = require('wits');

// Open your mind — the connection to the headset. This will quit after 10 retries.
mind.open();

// Start polling for data. The callback function will be called 128 times a second, so make sure it's performant.
mind.read(data => {
    console.log(data.levels.AF3);
});

// Pause your mind — data stream after 3 seconds. This stops the callback.
setTimeout(() => mind.pause(), 3000)

// Resume your mind — data stream after 5 seconds. This resumes the callback.
setTimeout(() => mind.resume(), 5000)

// Close your mind. This disconnects from the headset.
setTimeout(() => mind.close(), 9000)
```

## API

### Mind
Exposed by `require('wits')`. A singleton that has `open`, `close`, `read`, `pause` and `resume` methods to interact with Emotiv EPOC headset.

### mind.open() → `boolean`
Looks for an Emotiv EPOC USB device and tries to connect to the headset. Retries the connection 10 times and returns if a successful connection could be made. This is a blocking call.

#### Returns
`boolean` True if the connection is succesful


### mind.read(callback)
Sets a callback function to receive data from the headset represented as a [`Reading`](#reading) type. This function will be called approx. 128 times a second with an object representing the electrode values. Must be called after a `mind.open()`.

`wits` holds a single callback in memory. Subsequent calls to `mind.read` will replace the callback function and the previous handlers will stop receiving data. In other words, only the latest callback will receive new data packets.

#### Parameters
*`callback`* `function(`[`Reading`](#reading)`)`
A handler function that will receive an object confirming to type [`Reading`](#reading). This callback will continue to receive data packets until `mind.pause()` or `mind.close()` is executed.

### mind.pause()
Pauses the actively running incoming data stream. Useful to reduce CPU load when not in use. Must be called after a `mind.read()`.

### mind.resume()
Resumes the incoming data stream. Must be called after a `mind.pause()`.

### mind.close()
Disconnects from the headset, stopping the data flow. Must be called after a mind.open().

### Reading
Object representing data values streamed from the headset. Passed as the first parameter to the callback provided within the `mind.read` call.

Example:
```json
{
  "battery": 12,
  "counter": 128,
  "levels": {
    "F3": 7705,
    "FC6": 7766,
    "P7": 8192,
    "T8": 8514,
    "F7": 8126,
    "F8": 8362,
    "T7": 7953,
    "P8": 8558,
    "AF4": 8127,
    "F4": 9271,
    "AF3": 7949,
    "O2": 8239,
    "O1": 7705,
    "FC5": 8899
  },
  "cq": {
    "F3": 16,
    "FC6": 8,
    "P7": 0,
    "T8": 0,
    "F7": 8,
    "F8": 0,
    "T7": 16,
    "P8": 16,
    "AF4": 24,
    "F4": 16,
    "AF3": 16,
    "O2": 8,
    "O1": 24,
    "FC5": 16
  },
  "gyro": {
    "x": 0,
    "y": -1
  }
}
```

#### battery → `number`
Battery percentage between 0-100.
#### counter → `number`
A 7-bit unsigned integer that's automatically incremented in each sample. Useful to track if there are lost packets.

#### levels → [`Levels`](#levels)
An object that has 14 electrode names as keys and 14-bit unsigned integers for each electrode. The values represent the amplitude of the signal which is about 8.4mV peak-to-peak. The smallest unit (represented by 1 bit) is 0.51µV.

#### cq → [`ContactQuality`](#contact-quality)
An object that has 14 electrode names as keys and certain integers for each electrode.
#### gyro → [`Gyro`](#gyro)
An object with `x` and `y` values that represent left/right and up/down rotation of the head.

### Levels
An object that has 14 electrode names as keys and 14-bit unsigned integers for each electrode. The values represent the amplitude of the signal which is about 8.4mV peak-to-peak. The smallest unit (represented by 1 bit) is 0.51µV.

#### F3 → `number`
A 14-bit unsigned integer that represents the value of the F3 electrode
#### FC6 → `number`
A 14-bit unsigned integer that represents the value of the FC6 electrode
#### P7 → `number`
A 14-bit unsigned integer that represents the value of the P7 electrode
#### T8 → `number`
A 14-bit unsigned integer that represents the value of the T8 electrode
#### F7 → `number`
A 14-bit unsigned integer that represents the value of the F7 electrode
#### F8 → `number`
A 14-bit unsigned integer that represents the value of the F8 electrode
#### T7 → `number`
A 14-bit unsigned integer that represents the value of the T7 electrode
#### P8 → `number`
A 14-bit unsigned integer that represents the value of the P8 electrode
#### AF4 → `number`
A 14-bit unsigned integer that represents the value of the AF4 electrode
#### F4 → `number`
A 14-bit unsigned integer that represents the value of the F4 electrode
#### AF3 → `number`
A 14-bit unsigned integer that represents the value of the AF3 electrode
#### O2 → `number`
A 14-bit unsigned integer that represents the value of the O2 electrode
#### O1 → `number`
A 14-bit unsigned integer that represents the value of the O1 electrode

### ContactQuality
An object that has 14 electrode names as keys and certain integers for each electrode.

#### F3 → `number`
A 14-bit unsigned integer that represents the contact quality of the F3 electrode
#### FC6 → `number`
A 14-bit unsigned integer that represents the contact quality of the FC6 electrode
#### P7 → `number`
A 14-bit unsigned integer that represents the contact quality of the P7 electrode
#### T8 → `number`
A 14-bit unsigned integer that represents the contact quality of the T8 electrode
#### F7 → `number`
A 14-bit unsigned integer that represents the contact quality of the F7 electrode
#### F8 → `number`
A 14-bit unsigned integer that represents the contact quality of the F8 electrode
#### T7 → `number`
A 14-bit unsigned integer that represents the contact quality of the T7 electrode
#### P8 → `number`
A 14-bit unsigned integer that represents the contact quality of the P8 electrode
#### AF4 → `number`
A 14-bit unsigned integer that represents the contact quality of the AF4 electrode
#### F4 → `number`
A 14-bit unsigned integer that represents the contact quality of the F4 electrode
#### AF3 → `number`
A 14-bit unsigned integer that represents the contact quality of the AF3 electrode
#### O2 → `number`
A 14-bit unsigned integer that represents the contact quality of the O2 electrode
#### O1 → `number`
A 14-bit unsigned integer that represents the contact quality of the O1 electrode

### Gyro
An object with `x` and `y` values that represent left/right and up/down tilt of the head.

#### x → `number`
A 7-bit value that represents the momentary left/right rotation of the head.

#### y → `number`
A 7-bit value that represents the momentary up/down tilt of the head.

## Future work
`wits` has been born as part of [brain-bits](https://github.com/dashersw/brain-bits), an open source P300 speller. I subsequently thought it would be a better idea to make it into its own module, maybe creating a new standard interface for EEG headsets.

`wits` currently works with the first iteration of the EPOC headset, and not the EPOC+. This is the limitation of the underlying [openyou/emokit-c](https://github.com/openyou/emokit-c.git) library.

Here are a few useful features for the future:
* A band-pass filtered version alongside the raw data for easier plotting / operation
* Providing alpha / beta / theta / gamma band powers
* Incorporate more headsets so that `wits` become a universal library for EEG headsets
* A modular interface for easily incorporating middleware / processors (for classification or feature extraction)

## Contribution

`wits` is meant to simplify BCI development and is under heavy development. We would therefore appreciate if you gave us a hand.

If you would like to see a feature implemented or want to contribute a new
feature, you are welcome to open an issue to discuss it and we will be more than
happy to help.

If you choose to make a contribution, please fork this repository, work on a
feature and submit a pull request.

## MIT License

Copyright (c) 2018 Armagan Amcalar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
