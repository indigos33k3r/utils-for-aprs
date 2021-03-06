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

var util=require("util");
var sprintf=require("sprintf-js").sprintf;

function FrameError(msg) {
  this.detail=msg;
  this.message="Framing Error: " + msg;
}
util.inherits(FrameError, Error);

exports.FrameError=FrameError;

function InfoError(msg) {
  this.detail=msg;
  this.message=sprintf("Unknown data type: %s", msg);
}
util.inherits(InfoError, Error);
exports.InfoError=InfoError;

function FormatError(msg) {
  this.detail=msg;
  this.message=sprintf("Format error: %s", msg);
}
util.inherits(FormatError, Error);
exports.FormatError=FormatError;
