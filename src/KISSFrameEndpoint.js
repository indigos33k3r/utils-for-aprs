/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

var util=require('util');
var StateMachine=require('./StateMachine.js');
var EventEmitter=require('events');
var framing=require('./kiss-framing.js');
var KISSConnection=require('./KISSConnection.js');

// 'connection-machine-states' contains a state machine description that has the
// persistent connection behaviour that we want.
var states= require('./connection-machine-states.js');

/**
  This is an "Endpoint" that attempts to make a connection to a TCP KISS
  device, e.g. an instance of the DireWolf soundcard modem.

  Once enabled (by calling 'enable()'), the endpoint attempts to make a connection
  to the host and port that have been set into its properties.

  It will emit 'connect' and 'disconnect' events when it makes and/or loses a
  connection.  If the initial connection fails, or the connection is lost, the
  endpoint waits for a certain period of time (default 5s, configured by retryTime),
  and then attempts to reconnect.

  The 'connect' event delivers a KISSConnection object that represents the
  connection. It scans the input for properly-framed KISS packets, removing any
  byte-stuffing as required.  When a KISS frame is received, the endpoint emits a
  'data' event, with the received frame as the argument.  A KISS frame can be sent
  down the connection by calling the connection's 'data' method.

  @alias module:utils-for-aprs.KISSFrameEndpoint
  @extends EventEmitter
  @fires KISSFrameEndpoint#connection
  @constructor
*/
var KISSFrameEndpoint=function() {
  EventEmitter.apply(this);
  this.kissFrameParser=framing.tncFrameParser();
  /**
    Enable the endpoint.  Tells the endpoint to open its actual connection and
    begin trying to make connections.  If a connection fails, the endpoint will
    typically wait for five seconds and then try again, so long as the endpoint is
    enabled.
  */
  this.enable=function() {
    /* Note - this function is here for documentation purposes, but is actually
    replaced by the state machine setup, to be an event on the state machine.
    */
  };

  /**
    Disable the endpoint.  Tells the endpoint to close its actual connection and
    cease trying to make connections.  Connections currently in process will
    normall be closed.
  */
  this.disable=function() {
    /* Note - this function is here for documentation purposes, but is actually
    replaced by the state machine setup, to be an event on the state machine.
    */
  };
  StateMachine.call(this, states, 'Idle');

};

util.inherits(KISSFrameEndpoint, EventEmitter);

/**
  This function should open the physical connection.  It is called on
  entry to the Connecting state.  On successful opening, it should call
  'self.connectionSucceeded()' and on failure, it should call 'self.connectionFailed()',
  as expected by the state machine.

  @abstract
*/
KISSFrameEndpoint.prototype.openConnection=function() {
  console.log("Whoops - the abstract openConnection got called!");
}

/**

  (implemented by subclasses)

  The connection machine state table calls this function when the
  Connected state is entered.  It should create a KISSConnection object that
  is wrapped around the actual connection, and then emit a 'connect' event that
  passes the KISSConnection object as its argument.  Clients can then subscribe
  to either 'data' events on the KISSConnection to receive frames.  They can
  also call 'data(frame)' on the KISSConnection to send a frame.  When the
  connection gets closed, it will emit a 'closed' event, so the client knows to
  stop using it.

  When data arrives on the underlying port, it should be passed through the
  kissFrameParser, such that the connection object emits a 'data' event that
  contains the unescaped KISS frame, with the command header stripped.

  @abstract
*/
KISSFrameEndpoint.prototype.emitConnect=function() {
  this.emit('connect', undefined);
}

/**
  (Implemented by subclasses)
  Close the connection and emit a 'disconnect' event.
  @abstract
*/
KISSFrameEndpoint.prototype.closeConnectionAndEmitDisconnect=function() {
  this.emit('disconnect');
}

/**
  Called by the state machine states to trigger a timer that will call
  the timeout() method after a fixed time span (5000ms).
*/
KISSFrameEndpoint.prototype.triggerWait=function() {
  // The closures will be called in the context of the socket, so store the current
  // value of 'this' for use in the closures.
  var self=this;
  setTimeout(function() {
    self.timeout();
  }, 5000)
}

/**
  Connection event
  @event module:utils-for-aprs.KISSFrameEndpoint#connection
  @type {KISSConnection}
*/

// Export the endpoint constructor.
module.exports=KISSFrameEndpoint;
