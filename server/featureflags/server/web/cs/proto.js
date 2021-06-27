/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.featureflags = (function() {

    /**
     * Namespace featureflags.
     * @exports featureflags
     * @namespace
     */
    var featureflags = {};

    featureflags.backend = (function() {

        /**
         * Namespace backend.
         * @memberof featureflags
         * @namespace
         */
        var backend = {};

        backend.Id = (function() {

            /**
             * Properties of an Id.
             * @memberof featureflags.backend
             * @interface IId
             * @property {string|null} [value] Id value
             */

            /**
             * Constructs a new Id.
             * @memberof featureflags.backend
             * @classdesc Represents an Id.
             * @implements IId
             * @constructor
             * @param {featureflags.backend.IId=} [properties] Properties to set
             */
            function Id(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Id value.
             * @member {string} value
             * @memberof featureflags.backend.Id
             * @instance
             */
            Id.prototype.value = "";

            /**
             * Creates a new Id instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.Id
             * @static
             * @param {featureflags.backend.IId=} [properties] Properties to set
             * @returns {featureflags.backend.Id} Id instance
             */
            Id.create = function create(properties) {
                return new Id(properties);
            };

            /**
             * Encodes the specified Id message. Does not implicitly {@link featureflags.backend.Id.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.Id
             * @static
             * @param {featureflags.backend.IId} message Id message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Id.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified Id message, length delimited. Does not implicitly {@link featureflags.backend.Id.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.Id
             * @static
             * @param {featureflags.backend.IId} message Id message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Id.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Id message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.Id
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.Id} Id
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Id.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.Id();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Id message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.Id
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.Id} Id
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Id.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Id message.
             * @function verify
             * @memberof featureflags.backend.Id
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Id.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates an Id message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.Id
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.Id} Id
             */
            Id.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.Id)
                    return object;
                var message = new $root.featureflags.backend.Id();
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from an Id message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.Id
             * @static
             * @param {featureflags.backend.Id} message Id
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Id.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = "";
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Id to JSON.
             * @function toJSON
             * @memberof featureflags.backend.Id
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Id.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Id;
        })();

        backend.LocalId = (function() {

            /**
             * Properties of a LocalId.
             * @memberof featureflags.backend
             * @interface ILocalId
             * @property {string|null} [value] LocalId value
             * @property {string|null} [scope] LocalId scope
             */

            /**
             * Constructs a new LocalId.
             * @memberof featureflags.backend
             * @classdesc Represents a LocalId.
             * @implements ILocalId
             * @constructor
             * @param {featureflags.backend.ILocalId=} [properties] Properties to set
             */
            function LocalId(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LocalId value.
             * @member {string} value
             * @memberof featureflags.backend.LocalId
             * @instance
             */
            LocalId.prototype.value = "";

            /**
             * LocalId scope.
             * @member {string} scope
             * @memberof featureflags.backend.LocalId
             * @instance
             */
            LocalId.prototype.scope = "";

            /**
             * Creates a new LocalId instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {featureflags.backend.ILocalId=} [properties] Properties to set
             * @returns {featureflags.backend.LocalId} LocalId instance
             */
            LocalId.create = function create(properties) {
                return new LocalId(properties);
            };

            /**
             * Encodes the specified LocalId message. Does not implicitly {@link featureflags.backend.LocalId.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {featureflags.backend.ILocalId} message LocalId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocalId.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                if (message.scope != null && message.hasOwnProperty("scope"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.scope);
                return writer;
            };

            /**
             * Encodes the specified LocalId message, length delimited. Does not implicitly {@link featureflags.backend.LocalId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {featureflags.backend.ILocalId} message LocalId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocalId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LocalId message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.LocalId} LocalId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocalId.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.LocalId();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    case 2:
                        message.scope = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LocalId message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.LocalId} LocalId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocalId.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LocalId message.
             * @function verify
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LocalId.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                if (message.scope != null && message.hasOwnProperty("scope"))
                    if (!$util.isString(message.scope))
                        return "scope: string expected";
                return null;
            };

            /**
             * Creates a LocalId message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.LocalId} LocalId
             */
            LocalId.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.LocalId)
                    return object;
                var message = new $root.featureflags.backend.LocalId();
                if (object.value != null)
                    message.value = String(object.value);
                if (object.scope != null)
                    message.scope = String(object.scope);
                return message;
            };

            /**
             * Creates a plain object from a LocalId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.LocalId
             * @static
             * @param {featureflags.backend.LocalId} message LocalId
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LocalId.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.value = "";
                    object.scope = "";
                }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                if (message.scope != null && message.hasOwnProperty("scope"))
                    object.scope = message.scope;
                return object;
            };

            /**
             * Converts this LocalId to JSON.
             * @function toJSON
             * @memberof featureflags.backend.LocalId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LocalId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return LocalId;
        })();

        backend.EitherId = (function() {

            /**
             * Properties of an EitherId.
             * @memberof featureflags.backend
             * @interface IEitherId
             * @property {featureflags.backend.IId|null} [id] EitherId id
             * @property {featureflags.backend.ILocalId|null} [local_id] EitherId local_id
             */

            /**
             * Constructs a new EitherId.
             * @memberof featureflags.backend
             * @classdesc Represents an EitherId.
             * @implements IEitherId
             * @constructor
             * @param {featureflags.backend.IEitherId=} [properties] Properties to set
             */
            function EitherId(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EitherId id.
             * @member {featureflags.backend.IId|null|undefined} id
             * @memberof featureflags.backend.EitherId
             * @instance
             */
            EitherId.prototype.id = null;

            /**
             * EitherId local_id.
             * @member {featureflags.backend.ILocalId|null|undefined} local_id
             * @memberof featureflags.backend.EitherId
             * @instance
             */
            EitherId.prototype.local_id = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * EitherId kind.
             * @member {"id"|"local_id"|undefined} kind
             * @memberof featureflags.backend.EitherId
             * @instance
             */
            Object.defineProperty(EitherId.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["id", "local_id"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new EitherId instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {featureflags.backend.IEitherId=} [properties] Properties to set
             * @returns {featureflags.backend.EitherId} EitherId instance
             */
            EitherId.create = function create(properties) {
                return new EitherId(properties);
            };

            /**
             * Encodes the specified EitherId message. Does not implicitly {@link featureflags.backend.EitherId.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {featureflags.backend.IEitherId} message EitherId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EitherId.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    $root.featureflags.backend.Id.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.local_id != null && message.hasOwnProperty("local_id"))
                    $root.featureflags.backend.LocalId.encode(message.local_id, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EitherId message, length delimited. Does not implicitly {@link featureflags.backend.EitherId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {featureflags.backend.IEitherId} message EitherId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EitherId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EitherId message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.EitherId} EitherId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EitherId.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.EitherId();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.local_id = $root.featureflags.backend.LocalId.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EitherId message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.EitherId} EitherId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EitherId.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EitherId message.
             * @function verify
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EitherId.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id")) {
                    properties.kind = 1;
                    {
                        var error = $root.featureflags.backend.Id.verify(message.id);
                        if (error)
                            return "id." + error;
                    }
                }
                if (message.local_id != null && message.hasOwnProperty("local_id")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.featureflags.backend.LocalId.verify(message.local_id);
                        if (error)
                            return "local_id." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EitherId message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.EitherId} EitherId
             */
            EitherId.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.EitherId)
                    return object;
                var message = new $root.featureflags.backend.EitherId();
                if (object.id != null) {
                    if (typeof object.id !== "object")
                        throw TypeError(".featureflags.backend.EitherId.id: object expected");
                    message.id = $root.featureflags.backend.Id.fromObject(object.id);
                }
                if (object.local_id != null) {
                    if (typeof object.local_id !== "object")
                        throw TypeError(".featureflags.backend.EitherId.local_id: object expected");
                    message.local_id = $root.featureflags.backend.LocalId.fromObject(object.local_id);
                }
                return message;
            };

            /**
             * Creates a plain object from an EitherId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.EitherId
             * @static
             * @param {featureflags.backend.EitherId} message EitherId
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EitherId.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.id != null && message.hasOwnProperty("id")) {
                    object.id = $root.featureflags.backend.Id.toObject(message.id, options);
                    if (options.oneofs)
                        object.kind = "id";
                }
                if (message.local_id != null && message.hasOwnProperty("local_id")) {
                    object.local_id = $root.featureflags.backend.LocalId.toObject(message.local_id, options);
                    if (options.oneofs)
                        object.kind = "local_id";
                }
                return object;
            };

            /**
             * Converts this EitherId to JSON.
             * @function toJSON
             * @memberof featureflags.backend.EitherId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EitherId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EitherId;
        })();

        backend.SignIn = (function() {

            /**
             * Properties of a SignIn.
             * @memberof featureflags.backend
             * @interface ISignIn
             * @property {string|null} [username] SignIn username
             * @property {string|null} [password] SignIn password
             */

            /**
             * Constructs a new SignIn.
             * @memberof featureflags.backend
             * @classdesc Represents a SignIn.
             * @implements ISignIn
             * @constructor
             * @param {featureflags.backend.ISignIn=} [properties] Properties to set
             */
            function SignIn(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignIn username.
             * @member {string} username
             * @memberof featureflags.backend.SignIn
             * @instance
             */
            SignIn.prototype.username = "";

            /**
             * SignIn password.
             * @member {string} password
             * @memberof featureflags.backend.SignIn
             * @instance
             */
            SignIn.prototype.password = "";

            /**
             * Creates a new SignIn instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {featureflags.backend.ISignIn=} [properties] Properties to set
             * @returns {featureflags.backend.SignIn} SignIn instance
             */
            SignIn.create = function create(properties) {
                return new SignIn(properties);
            };

            /**
             * Encodes the specified SignIn message. Does not implicitly {@link featureflags.backend.SignIn.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {featureflags.backend.ISignIn} message SignIn message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignIn.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.username != null && message.hasOwnProperty("username"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.username);
                if (message.password != null && message.hasOwnProperty("password"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.password);
                return writer;
            };

            /**
             * Encodes the specified SignIn message, length delimited. Does not implicitly {@link featureflags.backend.SignIn.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {featureflags.backend.ISignIn} message SignIn message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignIn.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SignIn message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.SignIn} SignIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignIn.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.SignIn();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2:
                        message.username = reader.string();
                        break;
                    case 3:
                        message.password = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SignIn message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.SignIn} SignIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignIn.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SignIn message.
             * @function verify
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignIn.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.username != null && message.hasOwnProperty("username"))
                    if (!$util.isString(message.username))
                        return "username: string expected";
                if (message.password != null && message.hasOwnProperty("password"))
                    if (!$util.isString(message.password))
                        return "password: string expected";
                return null;
            };

            /**
             * Creates a SignIn message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.SignIn} SignIn
             */
            SignIn.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.SignIn)
                    return object;
                var message = new $root.featureflags.backend.SignIn();
                if (object.username != null)
                    message.username = String(object.username);
                if (object.password != null)
                    message.password = String(object.password);
                return message;
            };

            /**
             * Creates a plain object from a SignIn message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.SignIn
             * @static
             * @param {featureflags.backend.SignIn} message SignIn
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignIn.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.username = "";
                    object.password = "";
                }
                if (message.username != null && message.hasOwnProperty("username"))
                    object.username = message.username;
                if (message.password != null && message.hasOwnProperty("password"))
                    object.password = message.password;
                return object;
            };

            /**
             * Converts this SignIn to JSON.
             * @function toJSON
             * @memberof featureflags.backend.SignIn
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignIn.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return SignIn;
        })();

        backend.SignOut = (function() {

            /**
             * Properties of a SignOut.
             * @memberof featureflags.backend
             * @interface ISignOut
             */

            /**
             * Constructs a new SignOut.
             * @memberof featureflags.backend
             * @classdesc Represents a SignOut.
             * @implements ISignOut
             * @constructor
             * @param {featureflags.backend.ISignOut=} [properties] Properties to set
             */
            function SignOut(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new SignOut instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {featureflags.backend.ISignOut=} [properties] Properties to set
             * @returns {featureflags.backend.SignOut} SignOut instance
             */
            SignOut.create = function create(properties) {
                return new SignOut(properties);
            };

            /**
             * Encodes the specified SignOut message. Does not implicitly {@link featureflags.backend.SignOut.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {featureflags.backend.ISignOut} message SignOut message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignOut.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified SignOut message, length delimited. Does not implicitly {@link featureflags.backend.SignOut.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {featureflags.backend.ISignOut} message SignOut message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignOut.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SignOut message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.SignOut} SignOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignOut.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.SignOut();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SignOut message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.SignOut} SignOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignOut.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SignOut message.
             * @function verify
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignOut.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a SignOut message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.SignOut} SignOut
             */
            SignOut.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.SignOut)
                    return object;
                return new $root.featureflags.backend.SignOut();
            };

            /**
             * Creates a plain object from a SignOut message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.SignOut
             * @static
             * @param {featureflags.backend.SignOut} message SignOut
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignOut.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this SignOut to JSON.
             * @function toJSON
             * @memberof featureflags.backend.SignOut
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignOut.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return SignOut;
        })();

        backend.EnableFlag = (function() {

            /**
             * Properties of an EnableFlag.
             * @memberof featureflags.backend
             * @interface IEnableFlag
             * @property {featureflags.backend.IId|null} [flag_id] EnableFlag flag_id
             */

            /**
             * Constructs a new EnableFlag.
             * @memberof featureflags.backend
             * @classdesc Represents an EnableFlag.
             * @implements IEnableFlag
             * @constructor
             * @param {featureflags.backend.IEnableFlag=} [properties] Properties to set
             */
            function EnableFlag(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnableFlag flag_id.
             * @member {featureflags.backend.IId|null|undefined} flag_id
             * @memberof featureflags.backend.EnableFlag
             * @instance
             */
            EnableFlag.prototype.flag_id = null;

            /**
             * Creates a new EnableFlag instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {featureflags.backend.IEnableFlag=} [properties] Properties to set
             * @returns {featureflags.backend.EnableFlag} EnableFlag instance
             */
            EnableFlag.create = function create(properties) {
                return new EnableFlag(properties);
            };

            /**
             * Encodes the specified EnableFlag message. Does not implicitly {@link featureflags.backend.EnableFlag.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {featureflags.backend.IEnableFlag} message EnableFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnableFlag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    $root.featureflags.backend.Id.encode(message.flag_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EnableFlag message, length delimited. Does not implicitly {@link featureflags.backend.EnableFlag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {featureflags.backend.IEnableFlag} message EnableFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnableFlag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EnableFlag message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.EnableFlag} EnableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnableFlag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.EnableFlag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.flag_id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnableFlag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.EnableFlag} EnableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnableFlag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnableFlag message.
             * @function verify
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EnableFlag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flag_id != null && message.hasOwnProperty("flag_id")) {
                    var error = $root.featureflags.backend.Id.verify(message.flag_id);
                    if (error)
                        return "flag_id." + error;
                }
                return null;
            };

            /**
             * Creates an EnableFlag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.EnableFlag} EnableFlag
             */
            EnableFlag.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.EnableFlag)
                    return object;
                var message = new $root.featureflags.backend.EnableFlag();
                if (object.flag_id != null) {
                    if (typeof object.flag_id !== "object")
                        throw TypeError(".featureflags.backend.EnableFlag.flag_id: object expected");
                    message.flag_id = $root.featureflags.backend.Id.fromObject(object.flag_id);
                }
                return message;
            };

            /**
             * Creates a plain object from an EnableFlag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.EnableFlag
             * @static
             * @param {featureflags.backend.EnableFlag} message EnableFlag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnableFlag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.flag_id = null;
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    object.flag_id = $root.featureflags.backend.Id.toObject(message.flag_id, options);
                return object;
            };

            /**
             * Converts this EnableFlag to JSON.
             * @function toJSON
             * @memberof featureflags.backend.EnableFlag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EnableFlag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnableFlag;
        })();

        backend.DisableFlag = (function() {

            /**
             * Properties of a DisableFlag.
             * @memberof featureflags.backend
             * @interface IDisableFlag
             * @property {featureflags.backend.IId|null} [flag_id] DisableFlag flag_id
             */

            /**
             * Constructs a new DisableFlag.
             * @memberof featureflags.backend
             * @classdesc Represents a DisableFlag.
             * @implements IDisableFlag
             * @constructor
             * @param {featureflags.backend.IDisableFlag=} [properties] Properties to set
             */
            function DisableFlag(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DisableFlag flag_id.
             * @member {featureflags.backend.IId|null|undefined} flag_id
             * @memberof featureflags.backend.DisableFlag
             * @instance
             */
            DisableFlag.prototype.flag_id = null;

            /**
             * Creates a new DisableFlag instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {featureflags.backend.IDisableFlag=} [properties] Properties to set
             * @returns {featureflags.backend.DisableFlag} DisableFlag instance
             */
            DisableFlag.create = function create(properties) {
                return new DisableFlag(properties);
            };

            /**
             * Encodes the specified DisableFlag message. Does not implicitly {@link featureflags.backend.DisableFlag.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {featureflags.backend.IDisableFlag} message DisableFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DisableFlag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    $root.featureflags.backend.Id.encode(message.flag_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DisableFlag message, length delimited. Does not implicitly {@link featureflags.backend.DisableFlag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {featureflags.backend.IDisableFlag} message DisableFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DisableFlag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DisableFlag message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.DisableFlag} DisableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DisableFlag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.DisableFlag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.flag_id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DisableFlag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.DisableFlag} DisableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DisableFlag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DisableFlag message.
             * @function verify
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DisableFlag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flag_id != null && message.hasOwnProperty("flag_id")) {
                    var error = $root.featureflags.backend.Id.verify(message.flag_id);
                    if (error)
                        return "flag_id." + error;
                }
                return null;
            };

            /**
             * Creates a DisableFlag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.DisableFlag} DisableFlag
             */
            DisableFlag.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.DisableFlag)
                    return object;
                var message = new $root.featureflags.backend.DisableFlag();
                if (object.flag_id != null) {
                    if (typeof object.flag_id !== "object")
                        throw TypeError(".featureflags.backend.DisableFlag.flag_id: object expected");
                    message.flag_id = $root.featureflags.backend.Id.fromObject(object.flag_id);
                }
                return message;
            };

            /**
             * Creates a plain object from a DisableFlag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.DisableFlag
             * @static
             * @param {featureflags.backend.DisableFlag} message DisableFlag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DisableFlag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.flag_id = null;
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    object.flag_id = $root.featureflags.backend.Id.toObject(message.flag_id, options);
                return object;
            };

            /**
             * Converts this DisableFlag to JSON.
             * @function toJSON
             * @memberof featureflags.backend.DisableFlag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DisableFlag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DisableFlag;
        })();

        backend.ResetFlag = (function() {

            /**
             * Properties of a ResetFlag.
             * @memberof featureflags.backend
             * @interface IResetFlag
             * @property {featureflags.backend.IId|null} [flag_id] ResetFlag flag_id
             */

            /**
             * Constructs a new ResetFlag.
             * @memberof featureflags.backend
             * @classdesc Represents a ResetFlag.
             * @implements IResetFlag
             * @constructor
             * @param {featureflags.backend.IResetFlag=} [properties] Properties to set
             */
            function ResetFlag(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ResetFlag flag_id.
             * @member {featureflags.backend.IId|null|undefined} flag_id
             * @memberof featureflags.backend.ResetFlag
             * @instance
             */
            ResetFlag.prototype.flag_id = null;

            /**
             * Creates a new ResetFlag instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {featureflags.backend.IResetFlag=} [properties] Properties to set
             * @returns {featureflags.backend.ResetFlag} ResetFlag instance
             */
            ResetFlag.create = function create(properties) {
                return new ResetFlag(properties);
            };

            /**
             * Encodes the specified ResetFlag message. Does not implicitly {@link featureflags.backend.ResetFlag.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {featureflags.backend.IResetFlag} message ResetFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResetFlag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    $root.featureflags.backend.Id.encode(message.flag_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ResetFlag message, length delimited. Does not implicitly {@link featureflags.backend.ResetFlag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {featureflags.backend.IResetFlag} message ResetFlag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResetFlag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ResetFlag message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.ResetFlag} ResetFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResetFlag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.ResetFlag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.flag_id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ResetFlag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.ResetFlag} ResetFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResetFlag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ResetFlag message.
             * @function verify
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ResetFlag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flag_id != null && message.hasOwnProperty("flag_id")) {
                    var error = $root.featureflags.backend.Id.verify(message.flag_id);
                    if (error)
                        return "flag_id." + error;
                }
                return null;
            };

            /**
             * Creates a ResetFlag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.ResetFlag} ResetFlag
             */
            ResetFlag.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.ResetFlag)
                    return object;
                var message = new $root.featureflags.backend.ResetFlag();
                if (object.flag_id != null) {
                    if (typeof object.flag_id !== "object")
                        throw TypeError(".featureflags.backend.ResetFlag.flag_id: object expected");
                    message.flag_id = $root.featureflags.backend.Id.fromObject(object.flag_id);
                }
                return message;
            };

            /**
             * Creates a plain object from a ResetFlag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.ResetFlag
             * @static
             * @param {featureflags.backend.ResetFlag} message ResetFlag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ResetFlag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.flag_id = null;
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    object.flag_id = $root.featureflags.backend.Id.toObject(message.flag_id, options);
                return object;
            };

            /**
             * Converts this ResetFlag to JSON.
             * @function toJSON
             * @memberof featureflags.backend.ResetFlag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ResetFlag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ResetFlag;
        })();

        backend.AddCheck = (function() {

            /**
             * Properties of an AddCheck.
             * @memberof featureflags.backend
             * @interface IAddCheck
             * @property {featureflags.backend.ILocalId|null} [local_id] AddCheck local_id
             * @property {featureflags.backend.IId|null} [variable] AddCheck variable
             * @property {featureflags.graph.Check.Operator|null} [operator] AddCheck operator
             * @property {string|null} [value_string] AddCheck value_string
             * @property {number|null} [value_number] AddCheck value_number
             * @property {google.protobuf.ITimestamp|null} [value_timestamp] AddCheck value_timestamp
             * @property {featureflags.graph.ISet|null} [value_set] AddCheck value_set
             */

            /**
             * Constructs a new AddCheck.
             * @memberof featureflags.backend
             * @classdesc Represents an AddCheck.
             * @implements IAddCheck
             * @constructor
             * @param {featureflags.backend.IAddCheck=} [properties] Properties to set
             */
            function AddCheck(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddCheck local_id.
             * @member {featureflags.backend.ILocalId|null|undefined} local_id
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.local_id = null;

            /**
             * AddCheck variable.
             * @member {featureflags.backend.IId|null|undefined} variable
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.variable = null;

            /**
             * AddCheck operator.
             * @member {featureflags.graph.Check.Operator} operator
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.operator = 0;

            /**
             * AddCheck value_string.
             * @member {string} value_string
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.value_string = "";

            /**
             * AddCheck value_number.
             * @member {number} value_number
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.value_number = 0;

            /**
             * AddCheck value_timestamp.
             * @member {google.protobuf.ITimestamp|null|undefined} value_timestamp
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.value_timestamp = null;

            /**
             * AddCheck value_set.
             * @member {featureflags.graph.ISet|null|undefined} value_set
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            AddCheck.prototype.value_set = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * AddCheck kind.
             * @member {"value_string"|"value_number"|"value_timestamp"|"value_set"|undefined} kind
             * @memberof featureflags.backend.AddCheck
             * @instance
             */
            Object.defineProperty(AddCheck.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["value_string", "value_number", "value_timestamp", "value_set"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new AddCheck instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {featureflags.backend.IAddCheck=} [properties] Properties to set
             * @returns {featureflags.backend.AddCheck} AddCheck instance
             */
            AddCheck.create = function create(properties) {
                return new AddCheck(properties);
            };

            /**
             * Encodes the specified AddCheck message. Does not implicitly {@link featureflags.backend.AddCheck.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {featureflags.backend.IAddCheck} message AddCheck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddCheck.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.local_id != null && message.hasOwnProperty("local_id"))
                    $root.featureflags.backend.LocalId.encode(message.local_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.variable != null && message.hasOwnProperty("variable"))
                    $root.featureflags.backend.Id.encode(message.variable, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.operator != null && message.hasOwnProperty("operator"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.operator);
                if (message.value_string != null && message.hasOwnProperty("value_string"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.value_string);
                if (message.value_number != null && message.hasOwnProperty("value_number"))
                    writer.uint32(/* id 5, wireType 1 =*/41).double(message.value_number);
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp"))
                    $root.google.protobuf.Timestamp.encode(message.value_timestamp, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.value_set != null && message.hasOwnProperty("value_set"))
                    $root.featureflags.graph.Set.encode(message.value_set, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified AddCheck message, length delimited. Does not implicitly {@link featureflags.backend.AddCheck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {featureflags.backend.IAddCheck} message AddCheck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddCheck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddCheck message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.AddCheck} AddCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddCheck.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.AddCheck();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.local_id = $root.featureflags.backend.LocalId.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.variable = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.operator = reader.int32();
                        break;
                    case 4:
                        message.value_string = reader.string();
                        break;
                    case 5:
                        message.value_number = reader.double();
                        break;
                    case 6:
                        message.value_timestamp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.value_set = $root.featureflags.graph.Set.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AddCheck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.AddCheck} AddCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddCheck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddCheck message.
             * @function verify
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddCheck.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.local_id != null && message.hasOwnProperty("local_id")) {
                    var error = $root.featureflags.backend.LocalId.verify(message.local_id);
                    if (error)
                        return "local_id." + error;
                }
                if (message.variable != null && message.hasOwnProperty("variable")) {
                    var error = $root.featureflags.backend.Id.verify(message.variable);
                    if (error)
                        return "variable." + error;
                }
                if (message.operator != null && message.hasOwnProperty("operator"))
                    switch (message.operator) {
                    default:
                        return "operator: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        break;
                    }
                if (message.value_string != null && message.hasOwnProperty("value_string")) {
                    properties.kind = 1;
                    if (!$util.isString(message.value_string))
                        return "value_string: string expected";
                }
                if (message.value_number != null && message.hasOwnProperty("value_number")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.value_number !== "number")
                        return "value_number: number expected";
                }
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.google.protobuf.Timestamp.verify(message.value_timestamp);
                        if (error)
                            return "value_timestamp." + error;
                    }
                }
                if (message.value_set != null && message.hasOwnProperty("value_set")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.featureflags.graph.Set.verify(message.value_set);
                        if (error)
                            return "value_set." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an AddCheck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.AddCheck} AddCheck
             */
            AddCheck.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.AddCheck)
                    return object;
                var message = new $root.featureflags.backend.AddCheck();
                if (object.local_id != null) {
                    if (typeof object.local_id !== "object")
                        throw TypeError(".featureflags.backend.AddCheck.local_id: object expected");
                    message.local_id = $root.featureflags.backend.LocalId.fromObject(object.local_id);
                }
                if (object.variable != null) {
                    if (typeof object.variable !== "object")
                        throw TypeError(".featureflags.backend.AddCheck.variable: object expected");
                    message.variable = $root.featureflags.backend.Id.fromObject(object.variable);
                }
                switch (object.operator) {
                case "__DEFAULT__":
                case 0:
                    message.operator = 0;
                    break;
                case "EQUAL":
                case 1:
                    message.operator = 1;
                    break;
                case "LESS_THAN":
                case 2:
                    message.operator = 2;
                    break;
                case "LESS_OR_EQUAL":
                case 3:
                    message.operator = 3;
                    break;
                case "GREATER_THAN":
                case 4:
                    message.operator = 4;
                    break;
                case "GREATER_OR_EQUAL":
                case 5:
                    message.operator = 5;
                    break;
                case "CONTAINS":
                case 6:
                    message.operator = 6;
                    break;
                case "PERCENT":
                case 7:
                    message.operator = 7;
                    break;
                case "REGEXP":
                case 8:
                    message.operator = 8;
                    break;
                case "WILDCARD":
                case 9:
                    message.operator = 9;
                    break;
                case "SUBSET":
                case 10:
                    message.operator = 10;
                    break;
                case "SUPERSET":
                case 11:
                    message.operator = 11;
                    break;
                }
                if (object.value_string != null)
                    message.value_string = String(object.value_string);
                if (object.value_number != null)
                    message.value_number = Number(object.value_number);
                if (object.value_timestamp != null) {
                    if (typeof object.value_timestamp !== "object")
                        throw TypeError(".featureflags.backend.AddCheck.value_timestamp: object expected");
                    message.value_timestamp = $root.google.protobuf.Timestamp.fromObject(object.value_timestamp);
                }
                if (object.value_set != null) {
                    if (typeof object.value_set !== "object")
                        throw TypeError(".featureflags.backend.AddCheck.value_set: object expected");
                    message.value_set = $root.featureflags.graph.Set.fromObject(object.value_set);
                }
                return message;
            };

            /**
             * Creates a plain object from an AddCheck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.AddCheck
             * @static
             * @param {featureflags.backend.AddCheck} message AddCheck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddCheck.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.local_id = null;
                    object.variable = null;
                    object.operator = options.enums === String ? "__DEFAULT__" : 0;
                }
                if (message.local_id != null && message.hasOwnProperty("local_id"))
                    object.local_id = $root.featureflags.backend.LocalId.toObject(message.local_id, options);
                if (message.variable != null && message.hasOwnProperty("variable"))
                    object.variable = $root.featureflags.backend.Id.toObject(message.variable, options);
                if (message.operator != null && message.hasOwnProperty("operator"))
                    object.operator = options.enums === String ? $root.featureflags.graph.Check.Operator[message.operator] : message.operator;
                if (message.value_string != null && message.hasOwnProperty("value_string")) {
                    object.value_string = message.value_string;
                    if (options.oneofs)
                        object.kind = "value_string";
                }
                if (message.value_number != null && message.hasOwnProperty("value_number")) {
                    object.value_number = options.json && !isFinite(message.value_number) ? String(message.value_number) : message.value_number;
                    if (options.oneofs)
                        object.kind = "value_number";
                }
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp")) {
                    object.value_timestamp = $root.google.protobuf.Timestamp.toObject(message.value_timestamp, options);
                    if (options.oneofs)
                        object.kind = "value_timestamp";
                }
                if (message.value_set != null && message.hasOwnProperty("value_set")) {
                    object.value_set = $root.featureflags.graph.Set.toObject(message.value_set, options);
                    if (options.oneofs)
                        object.kind = "value_set";
                }
                return object;
            };

            /**
             * Converts this AddCheck to JSON.
             * @function toJSON
             * @memberof featureflags.backend.AddCheck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddCheck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return AddCheck;
        })();

        backend.AddCondition = (function() {

            /**
             * Properties of an AddCondition.
             * @memberof featureflags.backend
             * @interface IAddCondition
             * @property {featureflags.backend.IId|null} [flag_id] AddCondition flag_id
             * @property {featureflags.backend.ILocalId|null} [local_id] AddCondition local_id
             * @property {Array.<featureflags.backend.IEitherId>|null} [checks] AddCondition checks
             */

            /**
             * Constructs a new AddCondition.
             * @memberof featureflags.backend
             * @classdesc Represents an AddCondition.
             * @implements IAddCondition
             * @constructor
             * @param {featureflags.backend.IAddCondition=} [properties] Properties to set
             */
            function AddCondition(properties) {
                this.checks = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddCondition flag_id.
             * @member {featureflags.backend.IId|null|undefined} flag_id
             * @memberof featureflags.backend.AddCondition
             * @instance
             */
            AddCondition.prototype.flag_id = null;

            /**
             * AddCondition local_id.
             * @member {featureflags.backend.ILocalId|null|undefined} local_id
             * @memberof featureflags.backend.AddCondition
             * @instance
             */
            AddCondition.prototype.local_id = null;

            /**
             * AddCondition checks.
             * @member {Array.<featureflags.backend.IEitherId>} checks
             * @memberof featureflags.backend.AddCondition
             * @instance
             */
            AddCondition.prototype.checks = $util.emptyArray;

            /**
             * Creates a new AddCondition instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {featureflags.backend.IAddCondition=} [properties] Properties to set
             * @returns {featureflags.backend.AddCondition} AddCondition instance
             */
            AddCondition.create = function create(properties) {
                return new AddCondition(properties);
            };

            /**
             * Encodes the specified AddCondition message. Does not implicitly {@link featureflags.backend.AddCondition.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {featureflags.backend.IAddCondition} message AddCondition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddCondition.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    $root.featureflags.backend.Id.encode(message.flag_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.local_id != null && message.hasOwnProperty("local_id"))
                    $root.featureflags.backend.LocalId.encode(message.local_id, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.checks != null && message.checks.length)
                    for (var i = 0; i < message.checks.length; ++i)
                        $root.featureflags.backend.EitherId.encode(message.checks[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified AddCondition message, length delimited. Does not implicitly {@link featureflags.backend.AddCondition.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {featureflags.backend.IAddCondition} message AddCondition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddCondition.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddCondition message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.AddCondition} AddCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddCondition.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.AddCondition();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.flag_id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.local_id = $root.featureflags.backend.LocalId.decode(reader, reader.uint32());
                        break;
                    case 3:
                        if (!(message.checks && message.checks.length))
                            message.checks = [];
                        message.checks.push($root.featureflags.backend.EitherId.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AddCondition message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.AddCondition} AddCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddCondition.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddCondition message.
             * @function verify
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddCondition.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flag_id != null && message.hasOwnProperty("flag_id")) {
                    var error = $root.featureflags.backend.Id.verify(message.flag_id);
                    if (error)
                        return "flag_id." + error;
                }
                if (message.local_id != null && message.hasOwnProperty("local_id")) {
                    var error = $root.featureflags.backend.LocalId.verify(message.local_id);
                    if (error)
                        return "local_id." + error;
                }
                if (message.checks != null && message.hasOwnProperty("checks")) {
                    if (!Array.isArray(message.checks))
                        return "checks: array expected";
                    for (var i = 0; i < message.checks.length; ++i) {
                        var error = $root.featureflags.backend.EitherId.verify(message.checks[i]);
                        if (error)
                            return "checks." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an AddCondition message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.AddCondition} AddCondition
             */
            AddCondition.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.AddCondition)
                    return object;
                var message = new $root.featureflags.backend.AddCondition();
                if (object.flag_id != null) {
                    if (typeof object.flag_id !== "object")
                        throw TypeError(".featureflags.backend.AddCondition.flag_id: object expected");
                    message.flag_id = $root.featureflags.backend.Id.fromObject(object.flag_id);
                }
                if (object.local_id != null) {
                    if (typeof object.local_id !== "object")
                        throw TypeError(".featureflags.backend.AddCondition.local_id: object expected");
                    message.local_id = $root.featureflags.backend.LocalId.fromObject(object.local_id);
                }
                if (object.checks) {
                    if (!Array.isArray(object.checks))
                        throw TypeError(".featureflags.backend.AddCondition.checks: array expected");
                    message.checks = [];
                    for (var i = 0; i < object.checks.length; ++i) {
                        if (typeof object.checks[i] !== "object")
                            throw TypeError(".featureflags.backend.AddCondition.checks: object expected");
                        message.checks[i] = $root.featureflags.backend.EitherId.fromObject(object.checks[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an AddCondition message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.AddCondition
             * @static
             * @param {featureflags.backend.AddCondition} message AddCondition
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddCondition.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.checks = [];
                if (options.defaults) {
                    object.flag_id = null;
                    object.local_id = null;
                }
                if (message.flag_id != null && message.hasOwnProperty("flag_id"))
                    object.flag_id = $root.featureflags.backend.Id.toObject(message.flag_id, options);
                if (message.local_id != null && message.hasOwnProperty("local_id"))
                    object.local_id = $root.featureflags.backend.LocalId.toObject(message.local_id, options);
                if (message.checks && message.checks.length) {
                    object.checks = [];
                    for (var j = 0; j < message.checks.length; ++j)
                        object.checks[j] = $root.featureflags.backend.EitherId.toObject(message.checks[j], options);
                }
                return object;
            };

            /**
             * Converts this AddCondition to JSON.
             * @function toJSON
             * @memberof featureflags.backend.AddCondition
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddCondition.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return AddCondition;
        })();

        backend.DisableCondition = (function() {

            /**
             * Properties of a DisableCondition.
             * @memberof featureflags.backend
             * @interface IDisableCondition
             * @property {featureflags.backend.IId|null} [condition_id] DisableCondition condition_id
             */

            /**
             * Constructs a new DisableCondition.
             * @memberof featureflags.backend
             * @classdesc Represents a DisableCondition.
             * @implements IDisableCondition
             * @constructor
             * @param {featureflags.backend.IDisableCondition=} [properties] Properties to set
             */
            function DisableCondition(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DisableCondition condition_id.
             * @member {featureflags.backend.IId|null|undefined} condition_id
             * @memberof featureflags.backend.DisableCondition
             * @instance
             */
            DisableCondition.prototype.condition_id = null;

            /**
             * Creates a new DisableCondition instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {featureflags.backend.IDisableCondition=} [properties] Properties to set
             * @returns {featureflags.backend.DisableCondition} DisableCondition instance
             */
            DisableCondition.create = function create(properties) {
                return new DisableCondition(properties);
            };

            /**
             * Encodes the specified DisableCondition message. Does not implicitly {@link featureflags.backend.DisableCondition.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {featureflags.backend.IDisableCondition} message DisableCondition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DisableCondition.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.condition_id != null && message.hasOwnProperty("condition_id"))
                    $root.featureflags.backend.Id.encode(message.condition_id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DisableCondition message, length delimited. Does not implicitly {@link featureflags.backend.DisableCondition.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {featureflags.backend.IDisableCondition} message DisableCondition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DisableCondition.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DisableCondition message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.DisableCondition} DisableCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DisableCondition.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.DisableCondition();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.condition_id = $root.featureflags.backend.Id.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DisableCondition message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.DisableCondition} DisableCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DisableCondition.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DisableCondition message.
             * @function verify
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DisableCondition.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.condition_id != null && message.hasOwnProperty("condition_id")) {
                    var error = $root.featureflags.backend.Id.verify(message.condition_id);
                    if (error)
                        return "condition_id." + error;
                }
                return null;
            };

            /**
             * Creates a DisableCondition message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.DisableCondition} DisableCondition
             */
            DisableCondition.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.DisableCondition)
                    return object;
                var message = new $root.featureflags.backend.DisableCondition();
                if (object.condition_id != null) {
                    if (typeof object.condition_id !== "object")
                        throw TypeError(".featureflags.backend.DisableCondition.condition_id: object expected");
                    message.condition_id = $root.featureflags.backend.Id.fromObject(object.condition_id);
                }
                return message;
            };

            /**
             * Creates a plain object from a DisableCondition message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.DisableCondition
             * @static
             * @param {featureflags.backend.DisableCondition} message DisableCondition
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DisableCondition.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.condition_id = null;
                if (message.condition_id != null && message.hasOwnProperty("condition_id"))
                    object.condition_id = $root.featureflags.backend.Id.toObject(message.condition_id, options);
                return object;
            };

            /**
             * Converts this DisableCondition to JSON.
             * @function toJSON
             * @memberof featureflags.backend.DisableCondition
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DisableCondition.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DisableCondition;
        })();

        backend.Operation = (function() {

            /**
             * Properties of an Operation.
             * @memberof featureflags.backend
             * @interface IOperation
             * @property {featureflags.backend.IEnableFlag|null} [enable_flag] Operation enable_flag
             * @property {featureflags.backend.IDisableFlag|null} [disable_flag] Operation disable_flag
             * @property {featureflags.backend.IAddCondition|null} [add_condition] Operation add_condition
             * @property {featureflags.backend.IDisableCondition|null} [disable_condition] Operation disable_condition
             * @property {featureflags.backend.IAddCheck|null} [add_check] Operation add_check
             * @property {featureflags.backend.IResetFlag|null} [reset_flag] Operation reset_flag
             * @property {featureflags.backend.ISignIn|null} [sign_in] Operation sign_in
             * @property {featureflags.backend.ISignOut|null} [sign_out] Operation sign_out
             */

            /**
             * Constructs a new Operation.
             * @memberof featureflags.backend
             * @classdesc Represents an Operation.
             * @implements IOperation
             * @constructor
             * @param {featureflags.backend.IOperation=} [properties] Properties to set
             */
            function Operation(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Operation enable_flag.
             * @member {featureflags.backend.IEnableFlag|null|undefined} enable_flag
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.enable_flag = null;

            /**
             * Operation disable_flag.
             * @member {featureflags.backend.IDisableFlag|null|undefined} disable_flag
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.disable_flag = null;

            /**
             * Operation add_condition.
             * @member {featureflags.backend.IAddCondition|null|undefined} add_condition
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.add_condition = null;

            /**
             * Operation disable_condition.
             * @member {featureflags.backend.IDisableCondition|null|undefined} disable_condition
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.disable_condition = null;

            /**
             * Operation add_check.
             * @member {featureflags.backend.IAddCheck|null|undefined} add_check
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.add_check = null;

            /**
             * Operation reset_flag.
             * @member {featureflags.backend.IResetFlag|null|undefined} reset_flag
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.reset_flag = null;

            /**
             * Operation sign_in.
             * @member {featureflags.backend.ISignIn|null|undefined} sign_in
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.sign_in = null;

            /**
             * Operation sign_out.
             * @member {featureflags.backend.ISignOut|null|undefined} sign_out
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Operation.prototype.sign_out = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Operation op.
             * @member {"enable_flag"|"disable_flag"|"add_condition"|"disable_condition"|"add_check"|"reset_flag"|"sign_in"|"sign_out"|undefined} op
             * @memberof featureflags.backend.Operation
             * @instance
             */
            Object.defineProperty(Operation.prototype, "op", {
                get: $util.oneOfGetter($oneOfFields = ["enable_flag", "disable_flag", "add_condition", "disable_condition", "add_check", "reset_flag", "sign_in", "sign_out"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Operation instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.Operation
             * @static
             * @param {featureflags.backend.IOperation=} [properties] Properties to set
             * @returns {featureflags.backend.Operation} Operation instance
             */
            Operation.create = function create(properties) {
                return new Operation(properties);
            };

            /**
             * Encodes the specified Operation message. Does not implicitly {@link featureflags.backend.Operation.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.Operation
             * @static
             * @param {featureflags.backend.IOperation} message Operation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Operation.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.enable_flag != null && message.hasOwnProperty("enable_flag"))
                    $root.featureflags.backend.EnableFlag.encode(message.enable_flag, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.disable_flag != null && message.hasOwnProperty("disable_flag"))
                    $root.featureflags.backend.DisableFlag.encode(message.disable_flag, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.add_condition != null && message.hasOwnProperty("add_condition"))
                    $root.featureflags.backend.AddCondition.encode(message.add_condition, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.disable_condition != null && message.hasOwnProperty("disable_condition"))
                    $root.featureflags.backend.DisableCondition.encode(message.disable_condition, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.add_check != null && message.hasOwnProperty("add_check"))
                    $root.featureflags.backend.AddCheck.encode(message.add_check, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.reset_flag != null && message.hasOwnProperty("reset_flag"))
                    $root.featureflags.backend.ResetFlag.encode(message.reset_flag, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.sign_in != null && message.hasOwnProperty("sign_in"))
                    $root.featureflags.backend.SignIn.encode(message.sign_in, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.sign_out != null && message.hasOwnProperty("sign_out"))
                    $root.featureflags.backend.SignOut.encode(message.sign_out, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Operation message, length delimited. Does not implicitly {@link featureflags.backend.Operation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.Operation
             * @static
             * @param {featureflags.backend.IOperation} message Operation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Operation.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Operation message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.Operation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.Operation} Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Operation.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.Operation();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.enable_flag = $root.featureflags.backend.EnableFlag.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.disable_flag = $root.featureflags.backend.DisableFlag.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.add_condition = $root.featureflags.backend.AddCondition.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.disable_condition = $root.featureflags.backend.DisableCondition.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.add_check = $root.featureflags.backend.AddCheck.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.reset_flag = $root.featureflags.backend.ResetFlag.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.sign_in = $root.featureflags.backend.SignIn.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.sign_out = $root.featureflags.backend.SignOut.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Operation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.Operation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.Operation} Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Operation.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Operation message.
             * @function verify
             * @memberof featureflags.backend.Operation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Operation.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.enable_flag != null && message.hasOwnProperty("enable_flag")) {
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.EnableFlag.verify(message.enable_flag);
                        if (error)
                            return "enable_flag." + error;
                    }
                }
                if (message.disable_flag != null && message.hasOwnProperty("disable_flag")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.DisableFlag.verify(message.disable_flag);
                        if (error)
                            return "disable_flag." + error;
                    }
                }
                if (message.add_condition != null && message.hasOwnProperty("add_condition")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.AddCondition.verify(message.add_condition);
                        if (error)
                            return "add_condition." + error;
                    }
                }
                if (message.disable_condition != null && message.hasOwnProperty("disable_condition")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.DisableCondition.verify(message.disable_condition);
                        if (error)
                            return "disable_condition." + error;
                    }
                }
                if (message.add_check != null && message.hasOwnProperty("add_check")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.AddCheck.verify(message.add_check);
                        if (error)
                            return "add_check." + error;
                    }
                }
                if (message.reset_flag != null && message.hasOwnProperty("reset_flag")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.ResetFlag.verify(message.reset_flag);
                        if (error)
                            return "reset_flag." + error;
                    }
                }
                if (message.sign_in != null && message.hasOwnProperty("sign_in")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.SignIn.verify(message.sign_in);
                        if (error)
                            return "sign_in." + error;
                    }
                }
                if (message.sign_out != null && message.hasOwnProperty("sign_out")) {
                    if (properties.op === 1)
                        return "op: multiple values";
                    properties.op = 1;
                    {
                        var error = $root.featureflags.backend.SignOut.verify(message.sign_out);
                        if (error)
                            return "sign_out." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Operation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.Operation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.Operation} Operation
             */
            Operation.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.Operation)
                    return object;
                var message = new $root.featureflags.backend.Operation();
                if (object.enable_flag != null) {
                    if (typeof object.enable_flag !== "object")
                        throw TypeError(".featureflags.backend.Operation.enable_flag: object expected");
                    message.enable_flag = $root.featureflags.backend.EnableFlag.fromObject(object.enable_flag);
                }
                if (object.disable_flag != null) {
                    if (typeof object.disable_flag !== "object")
                        throw TypeError(".featureflags.backend.Operation.disable_flag: object expected");
                    message.disable_flag = $root.featureflags.backend.DisableFlag.fromObject(object.disable_flag);
                }
                if (object.add_condition != null) {
                    if (typeof object.add_condition !== "object")
                        throw TypeError(".featureflags.backend.Operation.add_condition: object expected");
                    message.add_condition = $root.featureflags.backend.AddCondition.fromObject(object.add_condition);
                }
                if (object.disable_condition != null) {
                    if (typeof object.disable_condition !== "object")
                        throw TypeError(".featureflags.backend.Operation.disable_condition: object expected");
                    message.disable_condition = $root.featureflags.backend.DisableCondition.fromObject(object.disable_condition);
                }
                if (object.add_check != null) {
                    if (typeof object.add_check !== "object")
                        throw TypeError(".featureflags.backend.Operation.add_check: object expected");
                    message.add_check = $root.featureflags.backend.AddCheck.fromObject(object.add_check);
                }
                if (object.reset_flag != null) {
                    if (typeof object.reset_flag !== "object")
                        throw TypeError(".featureflags.backend.Operation.reset_flag: object expected");
                    message.reset_flag = $root.featureflags.backend.ResetFlag.fromObject(object.reset_flag);
                }
                if (object.sign_in != null) {
                    if (typeof object.sign_in !== "object")
                        throw TypeError(".featureflags.backend.Operation.sign_in: object expected");
                    message.sign_in = $root.featureflags.backend.SignIn.fromObject(object.sign_in);
                }
                if (object.sign_out != null) {
                    if (typeof object.sign_out !== "object")
                        throw TypeError(".featureflags.backend.Operation.sign_out: object expected");
                    message.sign_out = $root.featureflags.backend.SignOut.fromObject(object.sign_out);
                }
                return message;
            };

            /**
             * Creates a plain object from an Operation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.Operation
             * @static
             * @param {featureflags.backend.Operation} message Operation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Operation.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.enable_flag != null && message.hasOwnProperty("enable_flag")) {
                    object.enable_flag = $root.featureflags.backend.EnableFlag.toObject(message.enable_flag, options);
                    if (options.oneofs)
                        object.op = "enable_flag";
                }
                if (message.disable_flag != null && message.hasOwnProperty("disable_flag")) {
                    object.disable_flag = $root.featureflags.backend.DisableFlag.toObject(message.disable_flag, options);
                    if (options.oneofs)
                        object.op = "disable_flag";
                }
                if (message.add_condition != null && message.hasOwnProperty("add_condition")) {
                    object.add_condition = $root.featureflags.backend.AddCondition.toObject(message.add_condition, options);
                    if (options.oneofs)
                        object.op = "add_condition";
                }
                if (message.disable_condition != null && message.hasOwnProperty("disable_condition")) {
                    object.disable_condition = $root.featureflags.backend.DisableCondition.toObject(message.disable_condition, options);
                    if (options.oneofs)
                        object.op = "disable_condition";
                }
                if (message.add_check != null && message.hasOwnProperty("add_check")) {
                    object.add_check = $root.featureflags.backend.AddCheck.toObject(message.add_check, options);
                    if (options.oneofs)
                        object.op = "add_check";
                }
                if (message.reset_flag != null && message.hasOwnProperty("reset_flag")) {
                    object.reset_flag = $root.featureflags.backend.ResetFlag.toObject(message.reset_flag, options);
                    if (options.oneofs)
                        object.op = "reset_flag";
                }
                if (message.sign_in != null && message.hasOwnProperty("sign_in")) {
                    object.sign_in = $root.featureflags.backend.SignIn.toObject(message.sign_in, options);
                    if (options.oneofs)
                        object.op = "sign_in";
                }
                if (message.sign_out != null && message.hasOwnProperty("sign_out")) {
                    object.sign_out = $root.featureflags.backend.SignOut.toObject(message.sign_out, options);
                    if (options.oneofs)
                        object.op = "sign_out";
                }
                return object;
            };

            /**
             * Converts this Operation to JSON.
             * @function toJSON
             * @memberof featureflags.backend.Operation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Operation.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Operation;
        })();

        backend.Request = (function() {

            /**
             * Properties of a Request.
             * @memberof featureflags.backend
             * @interface IRequest
             * @property {Array.<featureflags.backend.IOperation>|null} [operations] Request operations
             * @property {hiku.protobuf.query.INode|null} [query] Request query
             */

            /**
             * Constructs a new Request.
             * @memberof featureflags.backend
             * @classdesc Represents a Request.
             * @implements IRequest
             * @constructor
             * @param {featureflags.backend.IRequest=} [properties] Properties to set
             */
            function Request(properties) {
                this.operations = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Request operations.
             * @member {Array.<featureflags.backend.IOperation>} operations
             * @memberof featureflags.backend.Request
             * @instance
             */
            Request.prototype.operations = $util.emptyArray;

            /**
             * Request query.
             * @member {hiku.protobuf.query.INode|null|undefined} query
             * @memberof featureflags.backend.Request
             * @instance
             */
            Request.prototype.query = null;

            /**
             * Creates a new Request instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.Request
             * @static
             * @param {featureflags.backend.IRequest=} [properties] Properties to set
             * @returns {featureflags.backend.Request} Request instance
             */
            Request.create = function create(properties) {
                return new Request(properties);
            };

            /**
             * Encodes the specified Request message. Does not implicitly {@link featureflags.backend.Request.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.Request
             * @static
             * @param {featureflags.backend.IRequest} message Request message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Request.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.operations != null && message.operations.length)
                    for (var i = 0; i < message.operations.length; ++i)
                        $root.featureflags.backend.Operation.encode(message.operations[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.query != null && message.hasOwnProperty("query"))
                    $root.hiku.protobuf.query.Node.encode(message.query, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Request message, length delimited. Does not implicitly {@link featureflags.backend.Request.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.Request
             * @static
             * @param {featureflags.backend.IRequest} message Request message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Request.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Request message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.Request
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.Request} Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Request.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.Request();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.operations && message.operations.length))
                            message.operations = [];
                        message.operations.push($root.featureflags.backend.Operation.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        message.query = $root.hiku.protobuf.query.Node.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Request message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.Request
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.Request} Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Request.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Request message.
             * @function verify
             * @memberof featureflags.backend.Request
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Request.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.operations != null && message.hasOwnProperty("operations")) {
                    if (!Array.isArray(message.operations))
                        return "operations: array expected";
                    for (var i = 0; i < message.operations.length; ++i) {
                        var error = $root.featureflags.backend.Operation.verify(message.operations[i]);
                        if (error)
                            return "operations." + error;
                    }
                }
                if (message.query != null && message.hasOwnProperty("query")) {
                    var error = $root.hiku.protobuf.query.Node.verify(message.query);
                    if (error)
                        return "query." + error;
                }
                return null;
            };

            /**
             * Creates a Request message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.Request
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.Request} Request
             */
            Request.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.Request)
                    return object;
                var message = new $root.featureflags.backend.Request();
                if (object.operations) {
                    if (!Array.isArray(object.operations))
                        throw TypeError(".featureflags.backend.Request.operations: array expected");
                    message.operations = [];
                    for (var i = 0; i < object.operations.length; ++i) {
                        if (typeof object.operations[i] !== "object")
                            throw TypeError(".featureflags.backend.Request.operations: object expected");
                        message.operations[i] = $root.featureflags.backend.Operation.fromObject(object.operations[i]);
                    }
                }
                if (object.query != null) {
                    if (typeof object.query !== "object")
                        throw TypeError(".featureflags.backend.Request.query: object expected");
                    message.query = $root.hiku.protobuf.query.Node.fromObject(object.query);
                }
                return message;
            };

            /**
             * Creates a plain object from a Request message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.Request
             * @static
             * @param {featureflags.backend.Request} message Request
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Request.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.operations = [];
                if (options.defaults)
                    object.query = null;
                if (message.operations && message.operations.length) {
                    object.operations = [];
                    for (var j = 0; j < message.operations.length; ++j)
                        object.operations[j] = $root.featureflags.backend.Operation.toObject(message.operations[j], options);
                }
                if (message.query != null && message.hasOwnProperty("query"))
                    object.query = $root.hiku.protobuf.query.Node.toObject(message.query, options);
                return object;
            };

            /**
             * Converts this Request to JSON.
             * @function toJSON
             * @memberof featureflags.backend.Request
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Request.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Request;
        })();

        backend.Reply = (function() {

            /**
             * Properties of a Reply.
             * @memberof featureflags.backend
             * @interface IReply
             * @property {featureflags.graph.IResult|null} [result] Reply result
             */

            /**
             * Constructs a new Reply.
             * @memberof featureflags.backend
             * @classdesc Represents a Reply.
             * @implements IReply
             * @constructor
             * @param {featureflags.backend.IReply=} [properties] Properties to set
             */
            function Reply(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Reply result.
             * @member {featureflags.graph.IResult|null|undefined} result
             * @memberof featureflags.backend.Reply
             * @instance
             */
            Reply.prototype.result = null;

            /**
             * Creates a new Reply instance using the specified properties.
             * @function create
             * @memberof featureflags.backend.Reply
             * @static
             * @param {featureflags.backend.IReply=} [properties] Properties to set
             * @returns {featureflags.backend.Reply} Reply instance
             */
            Reply.create = function create(properties) {
                return new Reply(properties);
            };

            /**
             * Encodes the specified Reply message. Does not implicitly {@link featureflags.backend.Reply.verify|verify} messages.
             * @function encode
             * @memberof featureflags.backend.Reply
             * @static
             * @param {featureflags.backend.IReply} message Reply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Reply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.result != null && message.hasOwnProperty("result"))
                    $root.featureflags.graph.Result.encode(message.result, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Reply message, length delimited. Does not implicitly {@link featureflags.backend.Reply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.backend.Reply
             * @static
             * @param {featureflags.backend.IReply} message Reply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Reply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Reply message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.backend.Reply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.backend.Reply} Reply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Reply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.backend.Reply();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.result = $root.featureflags.graph.Result.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Reply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.backend.Reply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.backend.Reply} Reply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Reply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Reply message.
             * @function verify
             * @memberof featureflags.backend.Reply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Reply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.result != null && message.hasOwnProperty("result")) {
                    var error = $root.featureflags.graph.Result.verify(message.result);
                    if (error)
                        return "result." + error;
                }
                return null;
            };

            /**
             * Creates a Reply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.backend.Reply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.backend.Reply} Reply
             */
            Reply.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.backend.Reply)
                    return object;
                var message = new $root.featureflags.backend.Reply();
                if (object.result != null) {
                    if (typeof object.result !== "object")
                        throw TypeError(".featureflags.backend.Reply.result: object expected");
                    message.result = $root.featureflags.graph.Result.fromObject(object.result);
                }
                return message;
            };

            /**
             * Creates a plain object from a Reply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.backend.Reply
             * @static
             * @param {featureflags.backend.Reply} message Reply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Reply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.result = null;
                if (message.result != null && message.hasOwnProperty("result"))
                    object.result = $root.featureflags.graph.Result.toObject(message.result, options);
                return object;
            };

            /**
             * Converts this Reply to JSON.
             * @function toJSON
             * @memberof featureflags.backend.Reply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Reply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Reply;
        })();

        backend.Backend = (function() {

            /**
             * Constructs a new Backend service.
             * @memberof featureflags.backend
             * @classdesc Represents a Backend
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function Backend(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (Backend.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Backend;

            /**
             * Creates new Backend service using the specified rpc implementation.
             * @function create
             * @memberof featureflags.backend.Backend
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {Backend} RPC service. Useful where requests and/or responses are streamed.
             */
            Backend.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link featureflags.backend.Backend#call}.
             * @memberof featureflags.backend.Backend
             * @typedef callCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {featureflags.backend.Reply} [response] Reply
             */

            /**
             * Calls call.
             * @function call
             * @memberof featureflags.backend.Backend
             * @instance
             * @param {featureflags.backend.IRequest} request Request message or plain object
             * @param {featureflags.backend.Backend.callCallback} callback Node-style callback called with the error, if any, and Reply
             * @returns {undefined}
             * @variation 1
             */
            Backend.prototype.call = function call(request, callback) {
                return this.rpcCall(call, $root.featureflags.backend.Request, $root.featureflags.backend.Reply, request, callback);
            };

            /**
             * Calls call.
             * @function call
             * @memberof featureflags.backend.Backend
             * @instance
             * @param {featureflags.backend.IRequest} request Request message or plain object
             * @returns {Promise<featureflags.backend.Reply>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link featureflags.backend.Backend#call}.
             * @memberof featureflags.backend.Backend
             * @typedef CallCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {featureflags.backend.Reply} [response] Reply
             */

            /**
             * Calls Call.
             * @function call
             * @memberof featureflags.backend.Backend
             * @instance
             * @param {featureflags.backend.IRequest} request Request message or plain object
             * @param {featureflags.backend.Backend.CallCallback} callback Node-style callback called with the error, if any, and Reply
             * @returns {undefined}
             * @variation 1
             */
            Backend.prototype.call = function call(request, callback) {
                return this.rpcCall(call, $root.featureflags.backend.Request, $root.featureflags.backend.Reply, request, callback);
            };

            /**
             * Calls Call.
             * @function call
             * @memberof featureflags.backend.Backend
             * @instance
             * @param {featureflags.backend.IRequest} request Request message or plain object
             * @returns {Promise<featureflags.backend.Reply>} Promise
             * @variation 2
             */

            return Backend;
        })();

        return backend;
    })();

    featureflags.graph = (function() {

        /**
         * Namespace graph.
         * @memberof featureflags
         * @namespace
         */
        var graph = {};

        graph.Ref = (function() {

            /**
             * Properties of a Ref.
             * @memberof featureflags.graph
             * @interface IRef
             * @property {string|null} [Project] Ref Project
             * @property {string|null} [Flag] Ref Flag
             * @property {string|null} [Condition] Ref Condition
             * @property {string|null} [Check] Ref Check
             * @property {string|null} [Variable] Ref Variable
             */

            /**
             * Constructs a new Ref.
             * @memberof featureflags.graph
             * @classdesc Represents a Ref.
             * @implements IRef
             * @constructor
             * @param {featureflags.graph.IRef=} [properties] Properties to set
             */
            function Ref(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Ref Project.
             * @member {string} Project
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Ref.prototype.Project = "";

            /**
             * Ref Flag.
             * @member {string} Flag
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Ref.prototype.Flag = "";

            /**
             * Ref Condition.
             * @member {string} Condition
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Ref.prototype.Condition = "";

            /**
             * Ref Check.
             * @member {string} Check
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Ref.prototype.Check = "";

            /**
             * Ref Variable.
             * @member {string} Variable
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Ref.prototype.Variable = "";

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Ref to.
             * @member {"Project"|"Flag"|"Condition"|"Check"|"Variable"|undefined} to
             * @memberof featureflags.graph.Ref
             * @instance
             */
            Object.defineProperty(Ref.prototype, "to", {
                get: $util.oneOfGetter($oneOfFields = ["Project", "Flag", "Condition", "Check", "Variable"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Ref instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Ref
             * @static
             * @param {featureflags.graph.IRef=} [properties] Properties to set
             * @returns {featureflags.graph.Ref} Ref instance
             */
            Ref.create = function create(properties) {
                return new Ref(properties);
            };

            /**
             * Encodes the specified Ref message. Does not implicitly {@link featureflags.graph.Ref.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Ref
             * @static
             * @param {featureflags.graph.IRef} message Ref message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Ref.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Project != null && message.hasOwnProperty("Project"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.Project);
                if (message.Flag != null && message.hasOwnProperty("Flag"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.Flag);
                if (message.Condition != null && message.hasOwnProperty("Condition"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.Condition);
                if (message.Check != null && message.hasOwnProperty("Check"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.Check);
                if (message.Variable != null && message.hasOwnProperty("Variable"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.Variable);
                return writer;
            };

            /**
             * Encodes the specified Ref message, length delimited. Does not implicitly {@link featureflags.graph.Ref.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Ref
             * @static
             * @param {featureflags.graph.IRef} message Ref message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Ref.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Ref message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Ref
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Ref} Ref
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Ref.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Ref();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.Project = reader.string();
                        break;
                    case 2:
                        message.Flag = reader.string();
                        break;
                    case 3:
                        message.Condition = reader.string();
                        break;
                    case 4:
                        message.Check = reader.string();
                        break;
                    case 5:
                        message.Variable = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Ref message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Ref
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Ref} Ref
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Ref.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Ref message.
             * @function verify
             * @memberof featureflags.graph.Ref
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Ref.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.Project != null && message.hasOwnProperty("Project")) {
                    properties.to = 1;
                    if (!$util.isString(message.Project))
                        return "Project: string expected";
                }
                if (message.Flag != null && message.hasOwnProperty("Flag")) {
                    if (properties.to === 1)
                        return "to: multiple values";
                    properties.to = 1;
                    if (!$util.isString(message.Flag))
                        return "Flag: string expected";
                }
                if (message.Condition != null && message.hasOwnProperty("Condition")) {
                    if (properties.to === 1)
                        return "to: multiple values";
                    properties.to = 1;
                    if (!$util.isString(message.Condition))
                        return "Condition: string expected";
                }
                if (message.Check != null && message.hasOwnProperty("Check")) {
                    if (properties.to === 1)
                        return "to: multiple values";
                    properties.to = 1;
                    if (!$util.isString(message.Check))
                        return "Check: string expected";
                }
                if (message.Variable != null && message.hasOwnProperty("Variable")) {
                    if (properties.to === 1)
                        return "to: multiple values";
                    properties.to = 1;
                    if (!$util.isString(message.Variable))
                        return "Variable: string expected";
                }
                return null;
            };

            /**
             * Creates a Ref message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Ref
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Ref} Ref
             */
            Ref.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Ref)
                    return object;
                var message = new $root.featureflags.graph.Ref();
                if (object.Project != null)
                    message.Project = String(object.Project);
                if (object.Flag != null)
                    message.Flag = String(object.Flag);
                if (object.Condition != null)
                    message.Condition = String(object.Condition);
                if (object.Check != null)
                    message.Check = String(object.Check);
                if (object.Variable != null)
                    message.Variable = String(object.Variable);
                return message;
            };

            /**
             * Creates a plain object from a Ref message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Ref
             * @static
             * @param {featureflags.graph.Ref} message Ref
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Ref.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.Project != null && message.hasOwnProperty("Project")) {
                    object.Project = message.Project;
                    if (options.oneofs)
                        object.to = "Project";
                }
                if (message.Flag != null && message.hasOwnProperty("Flag")) {
                    object.Flag = message.Flag;
                    if (options.oneofs)
                        object.to = "Flag";
                }
                if (message.Condition != null && message.hasOwnProperty("Condition")) {
                    object.Condition = message.Condition;
                    if (options.oneofs)
                        object.to = "Condition";
                }
                if (message.Check != null && message.hasOwnProperty("Check")) {
                    object.Check = message.Check;
                    if (options.oneofs)
                        object.to = "Check";
                }
                if (message.Variable != null && message.hasOwnProperty("Variable")) {
                    object.Variable = message.Variable;
                    if (options.oneofs)
                        object.to = "Variable";
                }
                return object;
            };

            /**
             * Converts this Ref to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Ref
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Ref.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Ref;
        })();

        graph.Set = (function() {

            /**
             * Properties of a Set.
             * @memberof featureflags.graph
             * @interface ISet
             * @property {Array.<string>|null} [items] Set items
             */

            /**
             * Constructs a new Set.
             * @memberof featureflags.graph
             * @classdesc Represents a Set.
             * @implements ISet
             * @constructor
             * @param {featureflags.graph.ISet=} [properties] Properties to set
             */
            function Set(properties) {
                this.items = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Set items.
             * @member {Array.<string>} items
             * @memberof featureflags.graph.Set
             * @instance
             */
            Set.prototype.items = $util.emptyArray;

            /**
             * Creates a new Set instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Set
             * @static
             * @param {featureflags.graph.ISet=} [properties] Properties to set
             * @returns {featureflags.graph.Set} Set instance
             */
            Set.create = function create(properties) {
                return new Set(properties);
            };

            /**
             * Encodes the specified Set message. Does not implicitly {@link featureflags.graph.Set.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Set
             * @static
             * @param {featureflags.graph.ISet} message Set message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Set.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.items[i]);
                return writer;
            };

            /**
             * Encodes the specified Set message, length delimited. Does not implicitly {@link featureflags.graph.Set.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Set
             * @static
             * @param {featureflags.graph.ISet} message Set message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Set.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Set message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Set
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Set} Set
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Set.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Set();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Set message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Set
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Set} Set
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Set.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Set message.
             * @function verify
             * @memberof featureflags.graph.Set
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Set.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.items != null && message.hasOwnProperty("items")) {
                    if (!Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i)
                        if (!$util.isString(message.items[i]))
                            return "items: string[] expected";
                }
                return null;
            };

            /**
             * Creates a Set message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Set
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Set} Set
             */
            Set.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Set)
                    return object;
                var message = new $root.featureflags.graph.Set();
                if (object.items) {
                    if (!Array.isArray(object.items))
                        throw TypeError(".featureflags.graph.Set.items: array expected");
                    message.items = [];
                    for (var i = 0; i < object.items.length; ++i)
                        message.items[i] = String(object.items[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a Set message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Set
             * @static
             * @param {featureflags.graph.Set} message Set
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Set.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = [];
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = message.items[j];
                }
                return object;
            };

            /**
             * Converts this Set to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Set
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Set.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Set;
        })();

        graph.Variable = (function() {

            /**
             * Properties of a Variable.
             * @memberof featureflags.graph
             * @interface IVariable
             * @property {string|null} [id] Variable id
             * @property {string|null} [name] Variable name
             * @property {featureflags.graph.Variable.Type|null} [type] Variable type
             */

            /**
             * Constructs a new Variable.
             * @memberof featureflags.graph
             * @classdesc Represents a Variable.
             * @implements IVariable
             * @constructor
             * @param {featureflags.graph.IVariable=} [properties] Properties to set
             */
            function Variable(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Variable id.
             * @member {string} id
             * @memberof featureflags.graph.Variable
             * @instance
             */
            Variable.prototype.id = "";

            /**
             * Variable name.
             * @member {string} name
             * @memberof featureflags.graph.Variable
             * @instance
             */
            Variable.prototype.name = "";

            /**
             * Variable type.
             * @member {featureflags.graph.Variable.Type} type
             * @memberof featureflags.graph.Variable
             * @instance
             */
            Variable.prototype.type = 0;

            /**
             * Creates a new Variable instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Variable
             * @static
             * @param {featureflags.graph.IVariable=} [properties] Properties to set
             * @returns {featureflags.graph.Variable} Variable instance
             */
            Variable.create = function create(properties) {
                return new Variable(properties);
            };

            /**
             * Encodes the specified Variable message. Does not implicitly {@link featureflags.graph.Variable.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Variable
             * @static
             * @param {featureflags.graph.IVariable} message Variable message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Variable.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                return writer;
            };

            /**
             * Encodes the specified Variable message, length delimited. Does not implicitly {@link featureflags.graph.Variable.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Variable
             * @static
             * @param {featureflags.graph.IVariable} message Variable message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Variable.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Variable message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Variable
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Variable} Variable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Variable.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Variable();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.type = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Variable message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Variable
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Variable} Variable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Variable.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Variable message.
             * @function verify
             * @memberof featureflags.graph.Variable
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Variable.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                return null;
            };

            /**
             * Creates a Variable message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Variable
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Variable} Variable
             */
            Variable.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Variable)
                    return object;
                var message = new $root.featureflags.graph.Variable();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                switch (object.type) {
                case "__DEFAULT__":
                case 0:
                    message.type = 0;
                    break;
                case "STRING":
                case 1:
                    message.type = 1;
                    break;
                case "NUMBER":
                case 2:
                    message.type = 2;
                    break;
                case "TIMESTAMP":
                case 3:
                    message.type = 3;
                    break;
                case "SET":
                case 4:
                    message.type = 4;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a Variable message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Variable
             * @static
             * @param {featureflags.graph.Variable} message Variable
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Variable.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.type = options.enums === String ? "__DEFAULT__" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.featureflags.graph.Variable.Type[message.type] : message.type;
                return object;
            };

            /**
             * Converts this Variable to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Variable
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Variable.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Type enum.
             * @name featureflags.graph.Variable.Type
             * @enum {string}
             * @property {number} __DEFAULT__=0 __DEFAULT__ value
             * @property {number} STRING=1 STRING value
             * @property {number} NUMBER=2 NUMBER value
             * @property {number} TIMESTAMP=3 TIMESTAMP value
             * @property {number} SET=4 SET value
             */
            Variable.Type = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "__DEFAULT__"] = 0;
                values[valuesById[1] = "STRING"] = 1;
                values[valuesById[2] = "NUMBER"] = 2;
                values[valuesById[3] = "TIMESTAMP"] = 3;
                values[valuesById[4] = "SET"] = 4;
                return values;
            })();

            return Variable;
        })();

        graph.Check = (function() {

            /**
             * Properties of a Check.
             * @memberof featureflags.graph
             * @interface ICheck
             * @property {string|null} [id] Check id
             * @property {featureflags.graph.IRef|null} [variable] Check variable
             * @property {featureflags.graph.Check.Operator|null} [operator] Check operator
             * @property {string|null} [value_string] Check value_string
             * @property {number|null} [value_number] Check value_number
             * @property {google.protobuf.ITimestamp|null} [value_timestamp] Check value_timestamp
             * @property {featureflags.graph.ISet|null} [value_set] Check value_set
             */

            /**
             * Constructs a new Check.
             * @memberof featureflags.graph
             * @classdesc Represents a Check.
             * @implements ICheck
             * @constructor
             * @param {featureflags.graph.ICheck=} [properties] Properties to set
             */
            function Check(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Check id.
             * @member {string} id
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.id = "";

            /**
             * Check variable.
             * @member {featureflags.graph.IRef|null|undefined} variable
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.variable = null;

            /**
             * Check operator.
             * @member {featureflags.graph.Check.Operator} operator
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.operator = 0;

            /**
             * Check value_string.
             * @member {string} value_string
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.value_string = "";

            /**
             * Check value_number.
             * @member {number} value_number
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.value_number = 0;

            /**
             * Check value_timestamp.
             * @member {google.protobuf.ITimestamp|null|undefined} value_timestamp
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.value_timestamp = null;

            /**
             * Check value_set.
             * @member {featureflags.graph.ISet|null|undefined} value_set
             * @memberof featureflags.graph.Check
             * @instance
             */
            Check.prototype.value_set = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Check kind.
             * @member {"value_string"|"value_number"|"value_timestamp"|"value_set"|undefined} kind
             * @memberof featureflags.graph.Check
             * @instance
             */
            Object.defineProperty(Check.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["value_string", "value_number", "value_timestamp", "value_set"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Check instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Check
             * @static
             * @param {featureflags.graph.ICheck=} [properties] Properties to set
             * @returns {featureflags.graph.Check} Check instance
             */
            Check.create = function create(properties) {
                return new Check(properties);
            };

            /**
             * Encodes the specified Check message. Does not implicitly {@link featureflags.graph.Check.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Check
             * @static
             * @param {featureflags.graph.ICheck} message Check message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Check.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.variable != null && message.hasOwnProperty("variable"))
                    $root.featureflags.graph.Ref.encode(message.variable, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.operator != null && message.hasOwnProperty("operator"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.operator);
                if (message.value_string != null && message.hasOwnProperty("value_string"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.value_string);
                if (message.value_number != null && message.hasOwnProperty("value_number"))
                    writer.uint32(/* id 5, wireType 1 =*/41).double(message.value_number);
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp"))
                    $root.google.protobuf.Timestamp.encode(message.value_timestamp, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.value_set != null && message.hasOwnProperty("value_set"))
                    $root.featureflags.graph.Set.encode(message.value_set, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Check message, length delimited. Does not implicitly {@link featureflags.graph.Check.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Check
             * @static
             * @param {featureflags.graph.ICheck} message Check message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Check.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Check message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Check
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Check} Check
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Check.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Check();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.variable = $root.featureflags.graph.Ref.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.operator = reader.int32();
                        break;
                    case 4:
                        message.value_string = reader.string();
                        break;
                    case 5:
                        message.value_number = reader.double();
                        break;
                    case 6:
                        message.value_timestamp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.value_set = $root.featureflags.graph.Set.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Check message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Check
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Check} Check
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Check.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Check message.
             * @function verify
             * @memberof featureflags.graph.Check
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Check.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.variable != null && message.hasOwnProperty("variable")) {
                    var error = $root.featureflags.graph.Ref.verify(message.variable);
                    if (error)
                        return "variable." + error;
                }
                if (message.operator != null && message.hasOwnProperty("operator"))
                    switch (message.operator) {
                    default:
                        return "operator: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        break;
                    }
                if (message.value_string != null && message.hasOwnProperty("value_string")) {
                    properties.kind = 1;
                    if (!$util.isString(message.value_string))
                        return "value_string: string expected";
                }
                if (message.value_number != null && message.hasOwnProperty("value_number")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.value_number !== "number")
                        return "value_number: number expected";
                }
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.google.protobuf.Timestamp.verify(message.value_timestamp);
                        if (error)
                            return "value_timestamp." + error;
                    }
                }
                if (message.value_set != null && message.hasOwnProperty("value_set")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.featureflags.graph.Set.verify(message.value_set);
                        if (error)
                            return "value_set." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Check message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Check
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Check} Check
             */
            Check.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Check)
                    return object;
                var message = new $root.featureflags.graph.Check();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.variable != null) {
                    if (typeof object.variable !== "object")
                        throw TypeError(".featureflags.graph.Check.variable: object expected");
                    message.variable = $root.featureflags.graph.Ref.fromObject(object.variable);
                }
                switch (object.operator) {
                case "__DEFAULT__":
                case 0:
                    message.operator = 0;
                    break;
                case "EQUAL":
                case 1:
                    message.operator = 1;
                    break;
                case "LESS_THAN":
                case 2:
                    message.operator = 2;
                    break;
                case "LESS_OR_EQUAL":
                case 3:
                    message.operator = 3;
                    break;
                case "GREATER_THAN":
                case 4:
                    message.operator = 4;
                    break;
                case "GREATER_OR_EQUAL":
                case 5:
                    message.operator = 5;
                    break;
                case "CONTAINS":
                case 6:
                    message.operator = 6;
                    break;
                case "PERCENT":
                case 7:
                    message.operator = 7;
                    break;
                case "REGEXP":
                case 8:
                    message.operator = 8;
                    break;
                case "WILDCARD":
                case 9:
                    message.operator = 9;
                    break;
                case "SUBSET":
                case 10:
                    message.operator = 10;
                    break;
                case "SUPERSET":
                case 11:
                    message.operator = 11;
                    break;
                }
                if (object.value_string != null)
                    message.value_string = String(object.value_string);
                if (object.value_number != null)
                    message.value_number = Number(object.value_number);
                if (object.value_timestamp != null) {
                    if (typeof object.value_timestamp !== "object")
                        throw TypeError(".featureflags.graph.Check.value_timestamp: object expected");
                    message.value_timestamp = $root.google.protobuf.Timestamp.fromObject(object.value_timestamp);
                }
                if (object.value_set != null) {
                    if (typeof object.value_set !== "object")
                        throw TypeError(".featureflags.graph.Check.value_set: object expected");
                    message.value_set = $root.featureflags.graph.Set.fromObject(object.value_set);
                }
                return message;
            };

            /**
             * Creates a plain object from a Check message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Check
             * @static
             * @param {featureflags.graph.Check} message Check
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Check.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.id = "";
                    object.variable = null;
                    object.operator = options.enums === String ? "__DEFAULT__" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.variable != null && message.hasOwnProperty("variable"))
                    object.variable = $root.featureflags.graph.Ref.toObject(message.variable, options);
                if (message.operator != null && message.hasOwnProperty("operator"))
                    object.operator = options.enums === String ? $root.featureflags.graph.Check.Operator[message.operator] : message.operator;
                if (message.value_string != null && message.hasOwnProperty("value_string")) {
                    object.value_string = message.value_string;
                    if (options.oneofs)
                        object.kind = "value_string";
                }
                if (message.value_number != null && message.hasOwnProperty("value_number")) {
                    object.value_number = options.json && !isFinite(message.value_number) ? String(message.value_number) : message.value_number;
                    if (options.oneofs)
                        object.kind = "value_number";
                }
                if (message.value_timestamp != null && message.hasOwnProperty("value_timestamp")) {
                    object.value_timestamp = $root.google.protobuf.Timestamp.toObject(message.value_timestamp, options);
                    if (options.oneofs)
                        object.kind = "value_timestamp";
                }
                if (message.value_set != null && message.hasOwnProperty("value_set")) {
                    object.value_set = $root.featureflags.graph.Set.toObject(message.value_set, options);
                    if (options.oneofs)
                        object.kind = "value_set";
                }
                return object;
            };

            /**
             * Converts this Check to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Check
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Check.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Operator enum.
             * @name featureflags.graph.Check.Operator
             * @enum {string}
             * @property {number} __DEFAULT__=0 __DEFAULT__ value
             * @property {number} EQUAL=1 EQUAL value
             * @property {number} LESS_THAN=2 LESS_THAN value
             * @property {number} LESS_OR_EQUAL=3 LESS_OR_EQUAL value
             * @property {number} GREATER_THAN=4 GREATER_THAN value
             * @property {number} GREATER_OR_EQUAL=5 GREATER_OR_EQUAL value
             * @property {number} CONTAINS=6 CONTAINS value
             * @property {number} PERCENT=7 PERCENT value
             * @property {number} REGEXP=8 REGEXP value
             * @property {number} WILDCARD=9 WILDCARD value
             * @property {number} SUBSET=10 SUBSET value
             * @property {number} SUPERSET=11 SUPERSET value
             */
            Check.Operator = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "__DEFAULT__"] = 0;
                values[valuesById[1] = "EQUAL"] = 1;
                values[valuesById[2] = "LESS_THAN"] = 2;
                values[valuesById[3] = "LESS_OR_EQUAL"] = 3;
                values[valuesById[4] = "GREATER_THAN"] = 4;
                values[valuesById[5] = "GREATER_OR_EQUAL"] = 5;
                values[valuesById[6] = "CONTAINS"] = 6;
                values[valuesById[7] = "PERCENT"] = 7;
                values[valuesById[8] = "REGEXP"] = 8;
                values[valuesById[9] = "WILDCARD"] = 9;
                values[valuesById[10] = "SUBSET"] = 10;
                values[valuesById[11] = "SUPERSET"] = 11;
                return values;
            })();

            return Check;
        })();

        graph.Condition = (function() {

            /**
             * Properties of a Condition.
             * @memberof featureflags.graph
             * @interface ICondition
             * @property {string|null} [id] Condition id
             * @property {Array.<featureflags.graph.IRef>|null} [checks] Condition checks
             */

            /**
             * Constructs a new Condition.
             * @memberof featureflags.graph
             * @classdesc Represents a Condition.
             * @implements ICondition
             * @constructor
             * @param {featureflags.graph.ICondition=} [properties] Properties to set
             */
            function Condition(properties) {
                this.checks = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Condition id.
             * @member {string} id
             * @memberof featureflags.graph.Condition
             * @instance
             */
            Condition.prototype.id = "";

            /**
             * Condition checks.
             * @member {Array.<featureflags.graph.IRef>} checks
             * @memberof featureflags.graph.Condition
             * @instance
             */
            Condition.prototype.checks = $util.emptyArray;

            /**
             * Creates a new Condition instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Condition
             * @static
             * @param {featureflags.graph.ICondition=} [properties] Properties to set
             * @returns {featureflags.graph.Condition} Condition instance
             */
            Condition.create = function create(properties) {
                return new Condition(properties);
            };

            /**
             * Encodes the specified Condition message. Does not implicitly {@link featureflags.graph.Condition.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Condition
             * @static
             * @param {featureflags.graph.ICondition} message Condition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Condition.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.checks != null && message.checks.length)
                    for (var i = 0; i < message.checks.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.checks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Condition message, length delimited. Does not implicitly {@link featureflags.graph.Condition.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Condition
             * @static
             * @param {featureflags.graph.ICondition} message Condition message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Condition.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Condition message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Condition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Condition} Condition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Condition.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Condition();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        if (!(message.checks && message.checks.length))
                            message.checks = [];
                        message.checks.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Condition message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Condition
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Condition} Condition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Condition.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Condition message.
             * @function verify
             * @memberof featureflags.graph.Condition
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Condition.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.checks != null && message.hasOwnProperty("checks")) {
                    if (!Array.isArray(message.checks))
                        return "checks: array expected";
                    for (var i = 0; i < message.checks.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.checks[i]);
                        if (error)
                            return "checks." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Condition message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Condition
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Condition} Condition
             */
            Condition.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Condition)
                    return object;
                var message = new $root.featureflags.graph.Condition();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.checks) {
                    if (!Array.isArray(object.checks))
                        throw TypeError(".featureflags.graph.Condition.checks: array expected");
                    message.checks = [];
                    for (var i = 0; i < object.checks.length; ++i) {
                        if (typeof object.checks[i] !== "object")
                            throw TypeError(".featureflags.graph.Condition.checks: object expected");
                        message.checks[i] = $root.featureflags.graph.Ref.fromObject(object.checks[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Condition message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Condition
             * @static
             * @param {featureflags.graph.Condition} message Condition
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Condition.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.checks = [];
                if (options.defaults)
                    object.id = "";
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.checks && message.checks.length) {
                    object.checks = [];
                    for (var j = 0; j < message.checks.length; ++j)
                        object.checks[j] = $root.featureflags.graph.Ref.toObject(message.checks[j], options);
                }
                return object;
            };

            /**
             * Converts this Condition to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Condition
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Condition.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Condition;
        })();

        graph.Flag = (function() {

            /**
             * Properties of a Flag.
             * @memberof featureflags.graph
             * @interface IFlag
             * @property {string|null} [id] Flag id
             * @property {string|null} [name] Flag name
             * @property {featureflags.graph.IRef|null} [project] Flag project
             * @property {google.protobuf.IBoolValue|null} [enabled] Flag enabled
             * @property {Array.<featureflags.graph.IRef>|null} [conditions] Flag conditions
             * @property {google.protobuf.IBoolValue|null} [overridden] Flag overridden
             */

            /**
             * Constructs a new Flag.
             * @memberof featureflags.graph
             * @classdesc Represents a Flag.
             * @implements IFlag
             * @constructor
             * @param {featureflags.graph.IFlag=} [properties] Properties to set
             */
            function Flag(properties) {
                this.conditions = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Flag id.
             * @member {string} id
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.id = "";

            /**
             * Flag name.
             * @member {string} name
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.name = "";

            /**
             * Flag project.
             * @member {featureflags.graph.IRef|null|undefined} project
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.project = null;

            /**
             * Flag enabled.
             * @member {google.protobuf.IBoolValue|null|undefined} enabled
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.enabled = null;

            /**
             * Flag conditions.
             * @member {Array.<featureflags.graph.IRef>} conditions
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.conditions = $util.emptyArray;

            /**
             * Flag overridden.
             * @member {google.protobuf.IBoolValue|null|undefined} overridden
             * @memberof featureflags.graph.Flag
             * @instance
             */
            Flag.prototype.overridden = null;

            /**
             * Creates a new Flag instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Flag
             * @static
             * @param {featureflags.graph.IFlag=} [properties] Properties to set
             * @returns {featureflags.graph.Flag} Flag instance
             */
            Flag.create = function create(properties) {
                return new Flag(properties);
            };

            /**
             * Encodes the specified Flag message. Does not implicitly {@link featureflags.graph.Flag.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Flag
             * @static
             * @param {featureflags.graph.IFlag} message Flag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Flag.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.project != null && message.hasOwnProperty("project"))
                    $root.featureflags.graph.Ref.encode(message.project, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.enabled != null && message.hasOwnProperty("enabled"))
                    $root.google.protobuf.BoolValue.encode(message.enabled, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.conditions != null && message.conditions.length)
                    for (var i = 0; i < message.conditions.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.conditions[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.overridden != null && message.hasOwnProperty("overridden"))
                    $root.google.protobuf.BoolValue.encode(message.overridden, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Flag message, length delimited. Does not implicitly {@link featureflags.graph.Flag.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Flag
             * @static
             * @param {featureflags.graph.IFlag} message Flag message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Flag.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Flag message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Flag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Flag} Flag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Flag.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Flag();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.project = $root.featureflags.graph.Ref.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.enabled = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                        break;
                    case 5:
                        if (!(message.conditions && message.conditions.length))
                            message.conditions = [];
                        message.conditions.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    case 6:
                        message.overridden = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Flag message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Flag
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Flag} Flag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Flag.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Flag message.
             * @function verify
             * @memberof featureflags.graph.Flag
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Flag.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.project != null && message.hasOwnProperty("project")) {
                    var error = $root.featureflags.graph.Ref.verify(message.project);
                    if (error)
                        return "project." + error;
                }
                if (message.enabled != null && message.hasOwnProperty("enabled")) {
                    var error = $root.google.protobuf.BoolValue.verify(message.enabled);
                    if (error)
                        return "enabled." + error;
                }
                if (message.conditions != null && message.hasOwnProperty("conditions")) {
                    if (!Array.isArray(message.conditions))
                        return "conditions: array expected";
                    for (var i = 0; i < message.conditions.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.conditions[i]);
                        if (error)
                            return "conditions." + error;
                    }
                }
                if (message.overridden != null && message.hasOwnProperty("overridden")) {
                    var error = $root.google.protobuf.BoolValue.verify(message.overridden);
                    if (error)
                        return "overridden." + error;
                }
                return null;
            };

            /**
             * Creates a Flag message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Flag
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Flag} Flag
             */
            Flag.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Flag)
                    return object;
                var message = new $root.featureflags.graph.Flag();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.project != null) {
                    if (typeof object.project !== "object")
                        throw TypeError(".featureflags.graph.Flag.project: object expected");
                    message.project = $root.featureflags.graph.Ref.fromObject(object.project);
                }
                if (object.enabled != null) {
                    if (typeof object.enabled !== "object")
                        throw TypeError(".featureflags.graph.Flag.enabled: object expected");
                    message.enabled = $root.google.protobuf.BoolValue.fromObject(object.enabled);
                }
                if (object.conditions) {
                    if (!Array.isArray(object.conditions))
                        throw TypeError(".featureflags.graph.Flag.conditions: array expected");
                    message.conditions = [];
                    for (var i = 0; i < object.conditions.length; ++i) {
                        if (typeof object.conditions[i] !== "object")
                            throw TypeError(".featureflags.graph.Flag.conditions: object expected");
                        message.conditions[i] = $root.featureflags.graph.Ref.fromObject(object.conditions[i]);
                    }
                }
                if (object.overridden != null) {
                    if (typeof object.overridden !== "object")
                        throw TypeError(".featureflags.graph.Flag.overridden: object expected");
                    message.overridden = $root.google.protobuf.BoolValue.fromObject(object.overridden);
                }
                return message;
            };

            /**
             * Creates a plain object from a Flag message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Flag
             * @static
             * @param {featureflags.graph.Flag} message Flag
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Flag.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.conditions = [];
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.project = null;
                    object.enabled = null;
                    object.overridden = null;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.project != null && message.hasOwnProperty("project"))
                    object.project = $root.featureflags.graph.Ref.toObject(message.project, options);
                if (message.enabled != null && message.hasOwnProperty("enabled"))
                    object.enabled = $root.google.protobuf.BoolValue.toObject(message.enabled, options);
                if (message.conditions && message.conditions.length) {
                    object.conditions = [];
                    for (var j = 0; j < message.conditions.length; ++j)
                        object.conditions[j] = $root.featureflags.graph.Ref.toObject(message.conditions[j], options);
                }
                if (message.overridden != null && message.hasOwnProperty("overridden"))
                    object.overridden = $root.google.protobuf.BoolValue.toObject(message.overridden, options);
                return object;
            };

            /**
             * Converts this Flag to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Flag
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Flag.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Flag;
        })();

        graph.Project = (function() {

            /**
             * Properties of a Project.
             * @memberof featureflags.graph
             * @interface IProject
             * @property {string|null} [id] Project id
             * @property {string|null} [name] Project name
             * @property {number|null} [version] Project version
             * @property {Array.<featureflags.graph.IRef>|null} [variables] Project variables
             */

            /**
             * Constructs a new Project.
             * @memberof featureflags.graph
             * @classdesc Represents a Project.
             * @implements IProject
             * @constructor
             * @param {featureflags.graph.IProject=} [properties] Properties to set
             */
            function Project(properties) {
                this.variables = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Project id.
             * @member {string} id
             * @memberof featureflags.graph.Project
             * @instance
             */
            Project.prototype.id = "";

            /**
             * Project name.
             * @member {string} name
             * @memberof featureflags.graph.Project
             * @instance
             */
            Project.prototype.name = "";

            /**
             * Project version.
             * @member {number} version
             * @memberof featureflags.graph.Project
             * @instance
             */
            Project.prototype.version = 0;

            /**
             * Project variables.
             * @member {Array.<featureflags.graph.IRef>} variables
             * @memberof featureflags.graph.Project
             * @instance
             */
            Project.prototype.variables = $util.emptyArray;

            /**
             * Creates a new Project instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Project
             * @static
             * @param {featureflags.graph.IProject=} [properties] Properties to set
             * @returns {featureflags.graph.Project} Project instance
             */
            Project.create = function create(properties) {
                return new Project(properties);
            };

            /**
             * Encodes the specified Project message. Does not implicitly {@link featureflags.graph.Project.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Project
             * @static
             * @param {featureflags.graph.IProject} message Project message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Project.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.variables != null && message.variables.length)
                    for (var i = 0; i < message.variables.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.variables[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.version != null && message.hasOwnProperty("version"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.version);
                return writer;
            };

            /**
             * Encodes the specified Project message, length delimited. Does not implicitly {@link featureflags.graph.Project.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Project
             * @static
             * @param {featureflags.graph.IProject} message Project message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Project.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Project message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Project
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Project} Project
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Project.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Project();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 4:
                        message.version = reader.uint32();
                        break;
                    case 3:
                        if (!(message.variables && message.variables.length))
                            message.variables = [];
                        message.variables.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Project message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Project
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Project} Project
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Project.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Project message.
             * @function verify
             * @memberof featureflags.graph.Project
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Project.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isInteger(message.version))
                        return "version: integer expected";
                if (message.variables != null && message.hasOwnProperty("variables")) {
                    if (!Array.isArray(message.variables))
                        return "variables: array expected";
                    for (var i = 0; i < message.variables.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.variables[i]);
                        if (error)
                            return "variables." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Project message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Project
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Project} Project
             */
            Project.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Project)
                    return object;
                var message = new $root.featureflags.graph.Project();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.version != null)
                    message.version = object.version >>> 0;
                if (object.variables) {
                    if (!Array.isArray(object.variables))
                        throw TypeError(".featureflags.graph.Project.variables: array expected");
                    message.variables = [];
                    for (var i = 0; i < object.variables.length; ++i) {
                        if (typeof object.variables[i] !== "object")
                            throw TypeError(".featureflags.graph.Project.variables: object expected");
                        message.variables[i] = $root.featureflags.graph.Ref.fromObject(object.variables[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Project message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Project
             * @static
             * @param {featureflags.graph.Project} message Project
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Project.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.variables = [];
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.version = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.variables && message.variables.length) {
                    object.variables = [];
                    for (var j = 0; j < message.variables.length; ++j)
                        object.variables[j] = $root.featureflags.graph.Ref.toObject(message.variables[j], options);
                }
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                return object;
            };

            /**
             * Converts this Project to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Project
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Project.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Project;
        })();

        graph.Root = (function() {

            /**
             * Properties of a Root.
             * @memberof featureflags.graph
             * @interface IRoot
             * @property {featureflags.graph.IRef|null} [flag] Root flag
             * @property {Array.<featureflags.graph.IRef>|null} [flags] Root flags
             * @property {Array.<featureflags.graph.IRef>|null} [projects] Root projects
             * @property {boolean|null} [authenticated] Root authenticated
             * @property {Array.<featureflags.graph.IRef>|null} [flags_by_ids] Root flags_by_ids
             */

            /**
             * Constructs a new Root.
             * @memberof featureflags.graph
             * @classdesc Represents a Root.
             * @implements IRoot
             * @constructor
             * @param {featureflags.graph.IRoot=} [properties] Properties to set
             */
            function Root(properties) {
                this.flags = [];
                this.projects = [];
                this.flags_by_ids = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Root flag.
             * @member {featureflags.graph.IRef|null|undefined} flag
             * @memberof featureflags.graph.Root
             * @instance
             */
            Root.prototype.flag = null;

            /**
             * Root flags.
             * @member {Array.<featureflags.graph.IRef>} flags
             * @memberof featureflags.graph.Root
             * @instance
             */
            Root.prototype.flags = $util.emptyArray;

            /**
             * Root projects.
             * @member {Array.<featureflags.graph.IRef>} projects
             * @memberof featureflags.graph.Root
             * @instance
             */
            Root.prototype.projects = $util.emptyArray;

            /**
             * Root authenticated.
             * @member {boolean} authenticated
             * @memberof featureflags.graph.Root
             * @instance
             */
            Root.prototype.authenticated = false;

            /**
             * Root flags_by_ids.
             * @member {Array.<featureflags.graph.IRef>} flags_by_ids
             * @memberof featureflags.graph.Root
             * @instance
             */
            Root.prototype.flags_by_ids = $util.emptyArray;

            /**
             * Creates a new Root instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Root
             * @static
             * @param {featureflags.graph.IRoot=} [properties] Properties to set
             * @returns {featureflags.graph.Root} Root instance
             */
            Root.create = function create(properties) {
                return new Root(properties);
            };

            /**
             * Encodes the specified Root message. Does not implicitly {@link featureflags.graph.Root.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Root
             * @static
             * @param {featureflags.graph.IRoot} message Root message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Root.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flag != null && message.hasOwnProperty("flag"))
                    $root.featureflags.graph.Ref.encode(message.flag, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.flags != null && message.flags.length)
                    for (var i = 0; i < message.flags.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.flags[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.projects != null && message.projects.length)
                    for (var i = 0; i < message.projects.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.projects[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.authenticated != null && message.hasOwnProperty("authenticated"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.authenticated);
                if (message.flags_by_ids != null && message.flags_by_ids.length)
                    for (var i = 0; i < message.flags_by_ids.length; ++i)
                        $root.featureflags.graph.Ref.encode(message.flags_by_ids[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Root message, length delimited. Does not implicitly {@link featureflags.graph.Root.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Root
             * @static
             * @param {featureflags.graph.IRoot} message Root message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Root.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Root message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Root
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Root} Root
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Root.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Root();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.flag = $root.featureflags.graph.Ref.decode(reader, reader.uint32());
                        break;
                    case 2:
                        if (!(message.flags && message.flags.length))
                            message.flags = [];
                        message.flags.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.projects && message.projects.length))
                            message.projects = [];
                        message.projects.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    case 5:
                        message.authenticated = reader.bool();
                        break;
                    case 6:
                        if (!(message.flags_by_ids && message.flags_by_ids.length))
                            message.flags_by_ids = [];
                        message.flags_by_ids.push($root.featureflags.graph.Ref.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Root message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Root
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Root} Root
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Root.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Root message.
             * @function verify
             * @memberof featureflags.graph.Root
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Root.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flag != null && message.hasOwnProperty("flag")) {
                    var error = $root.featureflags.graph.Ref.verify(message.flag);
                    if (error)
                        return "flag." + error;
                }
                if (message.flags != null && message.hasOwnProperty("flags")) {
                    if (!Array.isArray(message.flags))
                        return "flags: array expected";
                    for (var i = 0; i < message.flags.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.flags[i]);
                        if (error)
                            return "flags." + error;
                    }
                }
                if (message.projects != null && message.hasOwnProperty("projects")) {
                    if (!Array.isArray(message.projects))
                        return "projects: array expected";
                    for (var i = 0; i < message.projects.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.projects[i]);
                        if (error)
                            return "projects." + error;
                    }
                }
                if (message.authenticated != null && message.hasOwnProperty("authenticated"))
                    if (typeof message.authenticated !== "boolean")
                        return "authenticated: boolean expected";
                if (message.flags_by_ids != null && message.hasOwnProperty("flags_by_ids")) {
                    if (!Array.isArray(message.flags_by_ids))
                        return "flags_by_ids: array expected";
                    for (var i = 0; i < message.flags_by_ids.length; ++i) {
                        var error = $root.featureflags.graph.Ref.verify(message.flags_by_ids[i]);
                        if (error)
                            return "flags_by_ids." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Root message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Root
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Root} Root
             */
            Root.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Root)
                    return object;
                var message = new $root.featureflags.graph.Root();
                if (object.flag != null) {
                    if (typeof object.flag !== "object")
                        throw TypeError(".featureflags.graph.Root.flag: object expected");
                    message.flag = $root.featureflags.graph.Ref.fromObject(object.flag);
                }
                if (object.flags) {
                    if (!Array.isArray(object.flags))
                        throw TypeError(".featureflags.graph.Root.flags: array expected");
                    message.flags = [];
                    for (var i = 0; i < object.flags.length; ++i) {
                        if (typeof object.flags[i] !== "object")
                            throw TypeError(".featureflags.graph.Root.flags: object expected");
                        message.flags[i] = $root.featureflags.graph.Ref.fromObject(object.flags[i]);
                    }
                }
                if (object.projects) {
                    if (!Array.isArray(object.projects))
                        throw TypeError(".featureflags.graph.Root.projects: array expected");
                    message.projects = [];
                    for (var i = 0; i < object.projects.length; ++i) {
                        if (typeof object.projects[i] !== "object")
                            throw TypeError(".featureflags.graph.Root.projects: object expected");
                        message.projects[i] = $root.featureflags.graph.Ref.fromObject(object.projects[i]);
                    }
                }
                if (object.authenticated != null)
                    message.authenticated = Boolean(object.authenticated);
                if (object.flags_by_ids) {
                    if (!Array.isArray(object.flags_by_ids))
                        throw TypeError(".featureflags.graph.Root.flags_by_ids: array expected");
                    message.flags_by_ids = [];
                    for (var i = 0; i < object.flags_by_ids.length; ++i) {
                        if (typeof object.flags_by_ids[i] !== "object")
                            throw TypeError(".featureflags.graph.Root.flags_by_ids: object expected");
                        message.flags_by_ids[i] = $root.featureflags.graph.Ref.fromObject(object.flags_by_ids[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Root message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Root
             * @static
             * @param {featureflags.graph.Root} message Root
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Root.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.flags = [];
                    object.projects = [];
                    object.flags_by_ids = [];
                }
                if (options.defaults) {
                    object.flag = null;
                    object.authenticated = false;
                }
                if (message.flag != null && message.hasOwnProperty("flag"))
                    object.flag = $root.featureflags.graph.Ref.toObject(message.flag, options);
                if (message.flags && message.flags.length) {
                    object.flags = [];
                    for (var j = 0; j < message.flags.length; ++j)
                        object.flags[j] = $root.featureflags.graph.Ref.toObject(message.flags[j], options);
                }
                if (message.projects && message.projects.length) {
                    object.projects = [];
                    for (var j = 0; j < message.projects.length; ++j)
                        object.projects[j] = $root.featureflags.graph.Ref.toObject(message.projects[j], options);
                }
                if (message.authenticated != null && message.hasOwnProperty("authenticated"))
                    object.authenticated = message.authenticated;
                if (message.flags_by_ids && message.flags_by_ids.length) {
                    object.flags_by_ids = [];
                    for (var j = 0; j < message.flags_by_ids.length; ++j)
                        object.flags_by_ids[j] = $root.featureflags.graph.Ref.toObject(message.flags_by_ids[j], options);
                }
                return object;
            };

            /**
             * Converts this Root to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Root
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Root.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Root;
        })();

        graph.Result = (function() {

            /**
             * Properties of a Result.
             * @memberof featureflags.graph
             * @interface IResult
             * @property {featureflags.graph.IRoot|null} [Root] Result Root
             * @property {Object.<string,featureflags.graph.IProject>|null} [Project] Result Project
             * @property {Object.<string,featureflags.graph.IFlag>|null} [Flag] Result Flag
             * @property {Object.<string,featureflags.graph.ICondition>|null} [Condition] Result Condition
             * @property {Object.<string,featureflags.graph.ICheck>|null} [Check] Result Check
             * @property {Object.<string,featureflags.graph.IVariable>|null} [Variable] Result Variable
             */

            /**
             * Constructs a new Result.
             * @memberof featureflags.graph
             * @classdesc Represents a Result.
             * @implements IResult
             * @constructor
             * @param {featureflags.graph.IResult=} [properties] Properties to set
             */
            function Result(properties) {
                this.Project = {};
                this.Flag = {};
                this.Condition = {};
                this.Check = {};
                this.Variable = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Result Root.
             * @member {featureflags.graph.IRoot|null|undefined} Root
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Root = null;

            /**
             * Result Project.
             * @member {Object.<string,featureflags.graph.IProject>} Project
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Project = $util.emptyObject;

            /**
             * Result Flag.
             * @member {Object.<string,featureflags.graph.IFlag>} Flag
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Flag = $util.emptyObject;

            /**
             * Result Condition.
             * @member {Object.<string,featureflags.graph.ICondition>} Condition
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Condition = $util.emptyObject;

            /**
             * Result Check.
             * @member {Object.<string,featureflags.graph.ICheck>} Check
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Check = $util.emptyObject;

            /**
             * Result Variable.
             * @member {Object.<string,featureflags.graph.IVariable>} Variable
             * @memberof featureflags.graph.Result
             * @instance
             */
            Result.prototype.Variable = $util.emptyObject;

            /**
             * Creates a new Result instance using the specified properties.
             * @function create
             * @memberof featureflags.graph.Result
             * @static
             * @param {featureflags.graph.IResult=} [properties] Properties to set
             * @returns {featureflags.graph.Result} Result instance
             */
            Result.create = function create(properties) {
                return new Result(properties);
            };

            /**
             * Encodes the specified Result message. Does not implicitly {@link featureflags.graph.Result.verify|verify} messages.
             * @function encode
             * @memberof featureflags.graph.Result
             * @static
             * @param {featureflags.graph.IResult} message Result message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Result.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Root != null && message.hasOwnProperty("Root"))
                    $root.featureflags.graph.Root.encode(message.Root, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.Project != null && message.hasOwnProperty("Project"))
                    for (var keys = Object.keys(message.Project), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.featureflags.graph.Project.encode(message.Project[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.Flag != null && message.hasOwnProperty("Flag"))
                    for (var keys = Object.keys(message.Flag), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.featureflags.graph.Flag.encode(message.Flag[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.Condition != null && message.hasOwnProperty("Condition"))
                    for (var keys = Object.keys(message.Condition), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.featureflags.graph.Condition.encode(message.Condition[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.Check != null && message.hasOwnProperty("Check"))
                    for (var keys = Object.keys(message.Check), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.featureflags.graph.Check.encode(message.Check[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.Variable != null && message.hasOwnProperty("Variable"))
                    for (var keys = Object.keys(message.Variable), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.featureflags.graph.Variable.encode(message.Variable[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified Result message, length delimited. Does not implicitly {@link featureflags.graph.Result.verify|verify} messages.
             * @function encodeDelimited
             * @memberof featureflags.graph.Result
             * @static
             * @param {featureflags.graph.IResult} message Result message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Result.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Result message from the specified reader or buffer.
             * @function decode
             * @memberof featureflags.graph.Result
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {featureflags.graph.Result} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Result.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.featureflags.graph.Result(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.Root = $root.featureflags.graph.Root.decode(reader, reader.uint32());
                        break;
                    case 2:
                        reader.skip().pos++;
                        if (message.Project === $util.emptyObject)
                            message.Project = {};
                        key = reader.string();
                        reader.pos++;
                        message.Project[key] = $root.featureflags.graph.Project.decode(reader, reader.uint32());
                        break;
                    case 3:
                        reader.skip().pos++;
                        if (message.Flag === $util.emptyObject)
                            message.Flag = {};
                        key = reader.string();
                        reader.pos++;
                        message.Flag[key] = $root.featureflags.graph.Flag.decode(reader, reader.uint32());
                        break;
                    case 4:
                        reader.skip().pos++;
                        if (message.Condition === $util.emptyObject)
                            message.Condition = {};
                        key = reader.string();
                        reader.pos++;
                        message.Condition[key] = $root.featureflags.graph.Condition.decode(reader, reader.uint32());
                        break;
                    case 5:
                        reader.skip().pos++;
                        if (message.Check === $util.emptyObject)
                            message.Check = {};
                        key = reader.string();
                        reader.pos++;
                        message.Check[key] = $root.featureflags.graph.Check.decode(reader, reader.uint32());
                        break;
                    case 6:
                        reader.skip().pos++;
                        if (message.Variable === $util.emptyObject)
                            message.Variable = {};
                        key = reader.string();
                        reader.pos++;
                        message.Variable[key] = $root.featureflags.graph.Variable.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Result message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof featureflags.graph.Result
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {featureflags.graph.Result} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Result.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Result message.
             * @function verify
             * @memberof featureflags.graph.Result
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Result.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Root != null && message.hasOwnProperty("Root")) {
                    var error = $root.featureflags.graph.Root.verify(message.Root);
                    if (error)
                        return "Root." + error;
                }
                if (message.Project != null && message.hasOwnProperty("Project")) {
                    if (!$util.isObject(message.Project))
                        return "Project: object expected";
                    var key = Object.keys(message.Project);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.featureflags.graph.Project.verify(message.Project[key[i]]);
                        if (error)
                            return "Project." + error;
                    }
                }
                if (message.Flag != null && message.hasOwnProperty("Flag")) {
                    if (!$util.isObject(message.Flag))
                        return "Flag: object expected";
                    var key = Object.keys(message.Flag);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.featureflags.graph.Flag.verify(message.Flag[key[i]]);
                        if (error)
                            return "Flag." + error;
                    }
                }
                if (message.Condition != null && message.hasOwnProperty("Condition")) {
                    if (!$util.isObject(message.Condition))
                        return "Condition: object expected";
                    var key = Object.keys(message.Condition);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.featureflags.graph.Condition.verify(message.Condition[key[i]]);
                        if (error)
                            return "Condition." + error;
                    }
                }
                if (message.Check != null && message.hasOwnProperty("Check")) {
                    if (!$util.isObject(message.Check))
                        return "Check: object expected";
                    var key = Object.keys(message.Check);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.featureflags.graph.Check.verify(message.Check[key[i]]);
                        if (error)
                            return "Check." + error;
                    }
                }
                if (message.Variable != null && message.hasOwnProperty("Variable")) {
                    if (!$util.isObject(message.Variable))
                        return "Variable: object expected";
                    var key = Object.keys(message.Variable);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.featureflags.graph.Variable.verify(message.Variable[key[i]]);
                        if (error)
                            return "Variable." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Result message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof featureflags.graph.Result
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {featureflags.graph.Result} Result
             */
            Result.fromObject = function fromObject(object) {
                if (object instanceof $root.featureflags.graph.Result)
                    return object;
                var message = new $root.featureflags.graph.Result();
                if (object.Root != null) {
                    if (typeof object.Root !== "object")
                        throw TypeError(".featureflags.graph.Result.Root: object expected");
                    message.Root = $root.featureflags.graph.Root.fromObject(object.Root);
                }
                if (object.Project) {
                    if (typeof object.Project !== "object")
                        throw TypeError(".featureflags.graph.Result.Project: object expected");
                    message.Project = {};
                    for (var keys = Object.keys(object.Project), i = 0; i < keys.length; ++i) {
                        if (typeof object.Project[keys[i]] !== "object")
                            throw TypeError(".featureflags.graph.Result.Project: object expected");
                        message.Project[keys[i]] = $root.featureflags.graph.Project.fromObject(object.Project[keys[i]]);
                    }
                }
                if (object.Flag) {
                    if (typeof object.Flag !== "object")
                        throw TypeError(".featureflags.graph.Result.Flag: object expected");
                    message.Flag = {};
                    for (var keys = Object.keys(object.Flag), i = 0; i < keys.length; ++i) {
                        if (typeof object.Flag[keys[i]] !== "object")
                            throw TypeError(".featureflags.graph.Result.Flag: object expected");
                        message.Flag[keys[i]] = $root.featureflags.graph.Flag.fromObject(object.Flag[keys[i]]);
                    }
                }
                if (object.Condition) {
                    if (typeof object.Condition !== "object")
                        throw TypeError(".featureflags.graph.Result.Condition: object expected");
                    message.Condition = {};
                    for (var keys = Object.keys(object.Condition), i = 0; i < keys.length; ++i) {
                        if (typeof object.Condition[keys[i]] !== "object")
                            throw TypeError(".featureflags.graph.Result.Condition: object expected");
                        message.Condition[keys[i]] = $root.featureflags.graph.Condition.fromObject(object.Condition[keys[i]]);
                    }
                }
                if (object.Check) {
                    if (typeof object.Check !== "object")
                        throw TypeError(".featureflags.graph.Result.Check: object expected");
                    message.Check = {};
                    for (var keys = Object.keys(object.Check), i = 0; i < keys.length; ++i) {
                        if (typeof object.Check[keys[i]] !== "object")
                            throw TypeError(".featureflags.graph.Result.Check: object expected");
                        message.Check[keys[i]] = $root.featureflags.graph.Check.fromObject(object.Check[keys[i]]);
                    }
                }
                if (object.Variable) {
                    if (typeof object.Variable !== "object")
                        throw TypeError(".featureflags.graph.Result.Variable: object expected");
                    message.Variable = {};
                    for (var keys = Object.keys(object.Variable), i = 0; i < keys.length; ++i) {
                        if (typeof object.Variable[keys[i]] !== "object")
                            throw TypeError(".featureflags.graph.Result.Variable: object expected");
                        message.Variable[keys[i]] = $root.featureflags.graph.Variable.fromObject(object.Variable[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Result message. Also converts values to other types if specified.
             * @function toObject
             * @memberof featureflags.graph.Result
             * @static
             * @param {featureflags.graph.Result} message Result
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Result.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults) {
                    object.Project = {};
                    object.Flag = {};
                    object.Condition = {};
                    object.Check = {};
                    object.Variable = {};
                }
                if (options.defaults)
                    object.Root = null;
                if (message.Root != null && message.hasOwnProperty("Root"))
                    object.Root = $root.featureflags.graph.Root.toObject(message.Root, options);
                var keys2;
                if (message.Project && (keys2 = Object.keys(message.Project)).length) {
                    object.Project = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.Project[keys2[j]] = $root.featureflags.graph.Project.toObject(message.Project[keys2[j]], options);
                }
                if (message.Flag && (keys2 = Object.keys(message.Flag)).length) {
                    object.Flag = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.Flag[keys2[j]] = $root.featureflags.graph.Flag.toObject(message.Flag[keys2[j]], options);
                }
                if (message.Condition && (keys2 = Object.keys(message.Condition)).length) {
                    object.Condition = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.Condition[keys2[j]] = $root.featureflags.graph.Condition.toObject(message.Condition[keys2[j]], options);
                }
                if (message.Check && (keys2 = Object.keys(message.Check)).length) {
                    object.Check = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.Check[keys2[j]] = $root.featureflags.graph.Check.toObject(message.Check[keys2[j]], options);
                }
                if (message.Variable && (keys2 = Object.keys(message.Variable)).length) {
                    object.Variable = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.Variable[keys2[j]] = $root.featureflags.graph.Variable.toObject(message.Variable[keys2[j]], options);
                }
                return object;
            };

            /**
             * Converts this Result to JSON.
             * @function toJSON
             * @memberof featureflags.graph.Result
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Result.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Result;
        })();

        return graph;
    })();

    return featureflags;
})();

$root.hiku = (function() {

    /**
     * Namespace hiku.
     * @exports hiku
     * @namespace
     */
    var hiku = {};

    hiku.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof hiku
         * @namespace
         */
        var protobuf = {};

        protobuf.query = (function() {

            /**
             * Namespace query.
             * @memberof hiku.protobuf
             * @namespace
             */
            var query = {};

            query.Field = (function() {

                /**
                 * Properties of a Field.
                 * @memberof hiku.protobuf.query
                 * @interface IField
                 * @property {string|null} [name] Field name
                 * @property {google.protobuf.IStruct|null} [options] Field options
                 */

                /**
                 * Constructs a new Field.
                 * @memberof hiku.protobuf.query
                 * @classdesc Represents a Field.
                 * @implements IField
                 * @constructor
                 * @param {hiku.protobuf.query.IField=} [properties] Properties to set
                 */
                function Field(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Field name.
                 * @member {string} name
                 * @memberof hiku.protobuf.query.Field
                 * @instance
                 */
                Field.prototype.name = "";

                /**
                 * Field options.
                 * @member {google.protobuf.IStruct|null|undefined} options
                 * @memberof hiku.protobuf.query.Field
                 * @instance
                 */
                Field.prototype.options = null;

                /**
                 * Creates a new Field instance using the specified properties.
                 * @function create
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {hiku.protobuf.query.IField=} [properties] Properties to set
                 * @returns {hiku.protobuf.query.Field} Field instance
                 */
                Field.create = function create(properties) {
                    return new Field(properties);
                };

                /**
                 * Encodes the specified Field message. Does not implicitly {@link hiku.protobuf.query.Field.verify|verify} messages.
                 * @function encode
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {hiku.protobuf.query.IField} message Field message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Field.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.options != null && message.hasOwnProperty("options"))
                        $root.google.protobuf.Struct.encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Field message, length delimited. Does not implicitly {@link hiku.protobuf.query.Field.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {hiku.protobuf.query.IField} message Field message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Field.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Field message from the specified reader or buffer.
                 * @function decode
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {hiku.protobuf.query.Field} Field
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Field.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hiku.protobuf.query.Field();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 3:
                            message.options = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Field message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {hiku.protobuf.query.Field} Field
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Field.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Field message.
                 * @function verify
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Field.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.options != null && message.hasOwnProperty("options")) {
                        var error = $root.google.protobuf.Struct.verify(message.options);
                        if (error)
                            return "options." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Field message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {hiku.protobuf.query.Field} Field
                 */
                Field.fromObject = function fromObject(object) {
                    if (object instanceof $root.hiku.protobuf.query.Field)
                        return object;
                    var message = new $root.hiku.protobuf.query.Field();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.options != null) {
                        if (typeof object.options !== "object")
                            throw TypeError(".hiku.protobuf.query.Field.options: object expected");
                        message.options = $root.google.protobuf.Struct.fromObject(object.options);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Field message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof hiku.protobuf.query.Field
                 * @static
                 * @param {hiku.protobuf.query.Field} message Field
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Field.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.options = null;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.options != null && message.hasOwnProperty("options"))
                        object.options = $root.google.protobuf.Struct.toObject(message.options, options);
                    return object;
                };

                /**
                 * Converts this Field to JSON.
                 * @function toJSON
                 * @memberof hiku.protobuf.query.Field
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Field.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Field;
            })();

            query.Link = (function() {

                /**
                 * Properties of a Link.
                 * @memberof hiku.protobuf.query
                 * @interface ILink
                 * @property {string|null} [name] Link name
                 * @property {hiku.protobuf.query.INode|null} [node] Link node
                 * @property {google.protobuf.IStruct|null} [options] Link options
                 */

                /**
                 * Constructs a new Link.
                 * @memberof hiku.protobuf.query
                 * @classdesc Represents a Link.
                 * @implements ILink
                 * @constructor
                 * @param {hiku.protobuf.query.ILink=} [properties] Properties to set
                 */
                function Link(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Link name.
                 * @member {string} name
                 * @memberof hiku.protobuf.query.Link
                 * @instance
                 */
                Link.prototype.name = "";

                /**
                 * Link node.
                 * @member {hiku.protobuf.query.INode|null|undefined} node
                 * @memberof hiku.protobuf.query.Link
                 * @instance
                 */
                Link.prototype.node = null;

                /**
                 * Link options.
                 * @member {google.protobuf.IStruct|null|undefined} options
                 * @memberof hiku.protobuf.query.Link
                 * @instance
                 */
                Link.prototype.options = null;

                /**
                 * Creates a new Link instance using the specified properties.
                 * @function create
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {hiku.protobuf.query.ILink=} [properties] Properties to set
                 * @returns {hiku.protobuf.query.Link} Link instance
                 */
                Link.create = function create(properties) {
                    return new Link(properties);
                };

                /**
                 * Encodes the specified Link message. Does not implicitly {@link hiku.protobuf.query.Link.verify|verify} messages.
                 * @function encode
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {hiku.protobuf.query.ILink} message Link message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Link.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.node != null && message.hasOwnProperty("node"))
                        $root.hiku.protobuf.query.Node.encode(message.node, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.options != null && message.hasOwnProperty("options"))
                        $root.google.protobuf.Struct.encode(message.options, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Link message, length delimited. Does not implicitly {@link hiku.protobuf.query.Link.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {hiku.protobuf.query.ILink} message Link message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Link.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Link message from the specified reader or buffer.
                 * @function decode
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {hiku.protobuf.query.Link} Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Link.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hiku.protobuf.query.Link();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.node = $root.hiku.protobuf.query.Node.decode(reader, reader.uint32());
                            break;
                        case 4:
                            message.options = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Link message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {hiku.protobuf.query.Link} Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Link.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Link message.
                 * @function verify
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Link.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.node != null && message.hasOwnProperty("node")) {
                        var error = $root.hiku.protobuf.query.Node.verify(message.node);
                        if (error)
                            return "node." + error;
                    }
                    if (message.options != null && message.hasOwnProperty("options")) {
                        var error = $root.google.protobuf.Struct.verify(message.options);
                        if (error)
                            return "options." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Link message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {hiku.protobuf.query.Link} Link
                 */
                Link.fromObject = function fromObject(object) {
                    if (object instanceof $root.hiku.protobuf.query.Link)
                        return object;
                    var message = new $root.hiku.protobuf.query.Link();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.node != null) {
                        if (typeof object.node !== "object")
                            throw TypeError(".hiku.protobuf.query.Link.node: object expected");
                        message.node = $root.hiku.protobuf.query.Node.fromObject(object.node);
                    }
                    if (object.options != null) {
                        if (typeof object.options !== "object")
                            throw TypeError(".hiku.protobuf.query.Link.options: object expected");
                        message.options = $root.google.protobuf.Struct.fromObject(object.options);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Link message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof hiku.protobuf.query.Link
                 * @static
                 * @param {hiku.protobuf.query.Link} message Link
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Link.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.node = null;
                        object.options = null;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.node != null && message.hasOwnProperty("node"))
                        object.node = $root.hiku.protobuf.query.Node.toObject(message.node, options);
                    if (message.options != null && message.hasOwnProperty("options"))
                        object.options = $root.google.protobuf.Struct.toObject(message.options, options);
                    return object;
                };

                /**
                 * Converts this Link to JSON.
                 * @function toJSON
                 * @memberof hiku.protobuf.query.Link
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Link.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Link;
            })();

            query.Item = (function() {

                /**
                 * Properties of an Item.
                 * @memberof hiku.protobuf.query
                 * @interface IItem
                 * @property {hiku.protobuf.query.IField|null} [field] Item field
                 * @property {hiku.protobuf.query.ILink|null} [link] Item link
                 */

                /**
                 * Constructs a new Item.
                 * @memberof hiku.protobuf.query
                 * @classdesc Represents an Item.
                 * @implements IItem
                 * @constructor
                 * @param {hiku.protobuf.query.IItem=} [properties] Properties to set
                 */
                function Item(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Item field.
                 * @member {hiku.protobuf.query.IField|null|undefined} field
                 * @memberof hiku.protobuf.query.Item
                 * @instance
                 */
                Item.prototype.field = null;

                /**
                 * Item link.
                 * @member {hiku.protobuf.query.ILink|null|undefined} link
                 * @memberof hiku.protobuf.query.Item
                 * @instance
                 */
                Item.prototype.link = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * Item value.
                 * @member {"field"|"link"|undefined} value
                 * @memberof hiku.protobuf.query.Item
                 * @instance
                 */
                Object.defineProperty(Item.prototype, "value", {
                    get: $util.oneOfGetter($oneOfFields = ["field", "link"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Item instance using the specified properties.
                 * @function create
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {hiku.protobuf.query.IItem=} [properties] Properties to set
                 * @returns {hiku.protobuf.query.Item} Item instance
                 */
                Item.create = function create(properties) {
                    return new Item(properties);
                };

                /**
                 * Encodes the specified Item message. Does not implicitly {@link hiku.protobuf.query.Item.verify|verify} messages.
                 * @function encode
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {hiku.protobuf.query.IItem} message Item message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Item.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.field != null && message.hasOwnProperty("field"))
                        $root.hiku.protobuf.query.Field.encode(message.field, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.link != null && message.hasOwnProperty("link"))
                        $root.hiku.protobuf.query.Link.encode(message.link, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Item message, length delimited. Does not implicitly {@link hiku.protobuf.query.Item.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {hiku.protobuf.query.IItem} message Item message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Item.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Item message from the specified reader or buffer.
                 * @function decode
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {hiku.protobuf.query.Item} Item
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Item.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hiku.protobuf.query.Item();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.field = $root.hiku.protobuf.query.Field.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.link = $root.hiku.protobuf.query.Link.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Item message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {hiku.protobuf.query.Item} Item
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Item.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Item message.
                 * @function verify
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Item.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.field != null && message.hasOwnProperty("field")) {
                        properties.value = 1;
                        {
                            var error = $root.hiku.protobuf.query.Field.verify(message.field);
                            if (error)
                                return "field." + error;
                        }
                    }
                    if (message.link != null && message.hasOwnProperty("link")) {
                        if (properties.value === 1)
                            return "value: multiple values";
                        properties.value = 1;
                        {
                            var error = $root.hiku.protobuf.query.Link.verify(message.link);
                            if (error)
                                return "link." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Item message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {hiku.protobuf.query.Item} Item
                 */
                Item.fromObject = function fromObject(object) {
                    if (object instanceof $root.hiku.protobuf.query.Item)
                        return object;
                    var message = new $root.hiku.protobuf.query.Item();
                    if (object.field != null) {
                        if (typeof object.field !== "object")
                            throw TypeError(".hiku.protobuf.query.Item.field: object expected");
                        message.field = $root.hiku.protobuf.query.Field.fromObject(object.field);
                    }
                    if (object.link != null) {
                        if (typeof object.link !== "object")
                            throw TypeError(".hiku.protobuf.query.Item.link: object expected");
                        message.link = $root.hiku.protobuf.query.Link.fromObject(object.link);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Item message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof hiku.protobuf.query.Item
                 * @static
                 * @param {hiku.protobuf.query.Item} message Item
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Item.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (message.field != null && message.hasOwnProperty("field")) {
                        object.field = $root.hiku.protobuf.query.Field.toObject(message.field, options);
                        if (options.oneofs)
                            object.value = "field";
                    }
                    if (message.link != null && message.hasOwnProperty("link")) {
                        object.link = $root.hiku.protobuf.query.Link.toObject(message.link, options);
                        if (options.oneofs)
                            object.value = "link";
                    }
                    return object;
                };

                /**
                 * Converts this Item to JSON.
                 * @function toJSON
                 * @memberof hiku.protobuf.query.Item
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Item.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Item;
            })();

            query.Node = (function() {

                /**
                 * Properties of a Node.
                 * @memberof hiku.protobuf.query
                 * @interface INode
                 * @property {Array.<hiku.protobuf.query.IItem>|null} [items] Node items
                 */

                /**
                 * Constructs a new Node.
                 * @memberof hiku.protobuf.query
                 * @classdesc Represents a Node.
                 * @implements INode
                 * @constructor
                 * @param {hiku.protobuf.query.INode=} [properties] Properties to set
                 */
                function Node(properties) {
                    this.items = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Node items.
                 * @member {Array.<hiku.protobuf.query.IItem>} items
                 * @memberof hiku.protobuf.query.Node
                 * @instance
                 */
                Node.prototype.items = $util.emptyArray;

                /**
                 * Creates a new Node instance using the specified properties.
                 * @function create
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {hiku.protobuf.query.INode=} [properties] Properties to set
                 * @returns {hiku.protobuf.query.Node} Node instance
                 */
                Node.create = function create(properties) {
                    return new Node(properties);
                };

                /**
                 * Encodes the specified Node message. Does not implicitly {@link hiku.protobuf.query.Node.verify|verify} messages.
                 * @function encode
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {hiku.protobuf.query.INode} message Node message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Node.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.items != null && message.items.length)
                        for (var i = 0; i < message.items.length; ++i)
                            $root.hiku.protobuf.query.Item.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Node message, length delimited. Does not implicitly {@link hiku.protobuf.query.Node.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {hiku.protobuf.query.INode} message Node message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Node.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Node message from the specified reader or buffer.
                 * @function decode
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {hiku.protobuf.query.Node} Node
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Node.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hiku.protobuf.query.Node();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.hiku.protobuf.query.Item.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Node message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {hiku.protobuf.query.Node} Node
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Node.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Node message.
                 * @function verify
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Node.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.items != null && message.hasOwnProperty("items")) {
                        if (!Array.isArray(message.items))
                            return "items: array expected";
                        for (var i = 0; i < message.items.length; ++i) {
                            var error = $root.hiku.protobuf.query.Item.verify(message.items[i]);
                            if (error)
                                return "items." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Node message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {hiku.protobuf.query.Node} Node
                 */
                Node.fromObject = function fromObject(object) {
                    if (object instanceof $root.hiku.protobuf.query.Node)
                        return object;
                    var message = new $root.hiku.protobuf.query.Node();
                    if (object.items) {
                        if (!Array.isArray(object.items))
                            throw TypeError(".hiku.protobuf.query.Node.items: array expected");
                        message.items = [];
                        for (var i = 0; i < object.items.length; ++i) {
                            if (typeof object.items[i] !== "object")
                                throw TypeError(".hiku.protobuf.query.Node.items: object expected");
                            message.items[i] = $root.hiku.protobuf.query.Item.fromObject(object.items[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Node message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof hiku.protobuf.query.Node
                 * @static
                 * @param {hiku.protobuf.query.Node} message Node
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Node.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.items = [];
                    if (message.items && message.items.length) {
                        object.items = [];
                        for (var j = 0; j < message.items.length; ++j)
                            object.items[j] = $root.hiku.protobuf.query.Item.toObject(message.items[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Node to JSON.
                 * @function toJSON
                 * @memberof hiku.protobuf.query.Node
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Node.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Node;
            })();

            return query;
        })();

        return protobuf;
    })();

    return hiku;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Struct = (function() {

            /**
             * Properties of a Struct.
             * @memberof google.protobuf
             * @interface IStruct
             * @property {Object.<string,google.protobuf.IValue>|null} [fields] Struct fields
             */

            /**
             * Constructs a new Struct.
             * @memberof google.protobuf
             * @classdesc Represents a Struct.
             * @implements IStruct
             * @constructor
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             */
            function Struct(properties) {
                this.fields = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Struct fields.
             * @member {Object.<string,google.protobuf.IValue>} fields
             * @memberof google.protobuf.Struct
             * @instance
             */
            Struct.prototype.fields = $util.emptyObject;

            /**
             * Creates a new Struct instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             * @returns {google.protobuf.Struct} Struct instance
             */
            Struct.create = function create(properties) {
                return new Struct(properties);
            };

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fields != null && message.hasOwnProperty("fields"))
                    for (var keys = Object.keys(message.fields), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.google.protobuf.Value.encode(message.fields[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Struct(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        reader.skip().pos++;
                        if (message.fields === $util.emptyObject)
                            message.fields = {};
                        key = reader.string();
                        reader.pos++;
                        message.fields[key] = $root.google.protobuf.Value.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Struct message.
             * @function verify
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Struct.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fields != null && message.hasOwnProperty("fields")) {
                    if (!$util.isObject(message.fields))
                        return "fields: object expected";
                    var key = Object.keys(message.fields);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.google.protobuf.Value.verify(message.fields[key[i]]);
                        if (error)
                            return "fields." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Struct)
                    return object;
                var message = new $root.google.protobuf.Struct();
                if (object.fields) {
                    if (typeof object.fields !== "object")
                        throw TypeError(".google.protobuf.Struct.fields: object expected");
                    message.fields = {};
                    for (var keys = Object.keys(object.fields), i = 0; i < keys.length; ++i) {
                        if (typeof object.fields[keys[i]] !== "object")
                            throw TypeError(".google.protobuf.Struct.fields: object expected");
                        message.fields[keys[i]] = $root.google.protobuf.Value.fromObject(object.fields[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.Struct} message Struct
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Struct.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.fields = {};
                var keys2;
                if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                    object.fields = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.fields[keys2[j]] = $root.google.protobuf.Value.toObject(message.fields[keys2[j]], options);
                }
                return object;
            };

            /**
             * Converts this Struct to JSON.
             * @function toJSON
             * @memberof google.protobuf.Struct
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Struct.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Struct;
        })();

        protobuf.Value = (function() {

            /**
             * Properties of a Value.
             * @memberof google.protobuf
             * @interface IValue
             * @property {google.protobuf.NullValue|null} [nullValue] Value nullValue
             * @property {number|null} [numberValue] Value numberValue
             * @property {string|null} [stringValue] Value stringValue
             * @property {boolean|null} [boolValue] Value boolValue
             * @property {google.protobuf.IStruct|null} [structValue] Value structValue
             * @property {google.protobuf.IListValue|null} [listValue] Value listValue
             */

            /**
             * Constructs a new Value.
             * @memberof google.protobuf
             * @classdesc Represents a Value.
             * @implements IValue
             * @constructor
             * @param {google.protobuf.IValue=} [properties] Properties to set
             */
            function Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Value nullValue.
             * @member {google.protobuf.NullValue} nullValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.nullValue = 0;

            /**
             * Value numberValue.
             * @member {number} numberValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.numberValue = 0;

            /**
             * Value stringValue.
             * @member {string} stringValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.stringValue = "";

            /**
             * Value boolValue.
             * @member {boolean} boolValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.boolValue = false;

            /**
             * Value structValue.
             * @member {google.protobuf.IStruct|null|undefined} structValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.structValue = null;

            /**
             * Value listValue.
             * @member {google.protobuf.IListValue|null|undefined} listValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.listValue = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Value kind.
             * @member {"nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue"|undefined} kind
             * @memberof google.protobuf.Value
             * @instance
             */
            Object.defineProperty(Value.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue=} [properties] Properties to set
             * @returns {google.protobuf.Value} Value instance
             */
            Value.create = function create(properties) {
                return new Value(properties);
            };

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nullValue != null && message.hasOwnProperty("nullValue"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nullValue);
                if (message.numberValue != null && message.hasOwnProperty("numberValue"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.numberValue);
                if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.stringValue);
                if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue);
                if (message.structValue != null && message.hasOwnProperty("structValue"))
                    $root.google.protobuf.Struct.encode(message.structValue, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.listValue != null && message.hasOwnProperty("listValue"))
                    $root.google.protobuf.ListValue.encode(message.listValue, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.nullValue = reader.int32();
                        break;
                    case 2:
                        message.numberValue = reader.double();
                        break;
                    case 3:
                        message.stringValue = reader.string();
                        break;
                    case 4:
                        message.boolValue = reader.bool();
                        break;
                    case 5:
                        message.structValue = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.listValue = $root.google.protobuf.ListValue.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Value message.
             * @function verify
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    properties.kind = 1;
                    switch (message.nullValue) {
                    default:
                        return "nullValue: enum value expected";
                    case 0:
                        break;
                    }
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.numberValue !== "number")
                        return "numberValue: number expected";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.google.protobuf.Struct.verify(message.structValue);
                        if (error)
                            return "structValue." + error;
                    }
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.google.protobuf.ListValue.verify(message.listValue);
                        if (error)
                            return "listValue." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Value)
                    return object;
                var message = new $root.google.protobuf.Value();
                switch (object.nullValue) {
                case "NULL_VALUE":
                case 0:
                    message.nullValue = 0;
                    break;
                }
                if (object.numberValue != null)
                    message.numberValue = Number(object.numberValue);
                if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                if (object.boolValue != null)
                    message.boolValue = Boolean(object.boolValue);
                if (object.structValue != null) {
                    if (typeof object.structValue !== "object")
                        throw TypeError(".google.protobuf.Value.structValue: object expected");
                    message.structValue = $root.google.protobuf.Struct.fromObject(object.structValue);
                }
                if (object.listValue != null) {
                    if (typeof object.listValue !== "object")
                        throw TypeError(".google.protobuf.Value.listValue: object expected");
                    message.listValue = $root.google.protobuf.ListValue.fromObject(object.listValue);
                }
                return message;
            };

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.Value} message Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    object.nullValue = options.enums === String ? $root.google.protobuf.NullValue[message.nullValue] : message.nullValue;
                    if (options.oneofs)
                        object.kind = "nullValue";
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    object.numberValue = options.json && !isFinite(message.numberValue) ? String(message.numberValue) : message.numberValue;
                    if (options.oneofs)
                        object.kind = "numberValue";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                        object.kind = "stringValue";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    object.boolValue = message.boolValue;
                    if (options.oneofs)
                        object.kind = "boolValue";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    object.structValue = $root.google.protobuf.Struct.toObject(message.structValue, options);
                    if (options.oneofs)
                        object.kind = "structValue";
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    object.listValue = $root.google.protobuf.ListValue.toObject(message.listValue, options);
                    if (options.oneofs)
                        object.kind = "listValue";
                }
                return object;
            };

            /**
             * Converts this Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Value;
        })();

        /**
         * NullValue enum.
         * @name google.protobuf.NullValue
         * @enum {string}
         * @property {number} NULL_VALUE=0 NULL_VALUE value
         */
        protobuf.NullValue = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NULL_VALUE"] = 0;
            return values;
        })();

        protobuf.ListValue = (function() {

            /**
             * Properties of a ListValue.
             * @memberof google.protobuf
             * @interface IListValue
             * @property {Array.<google.protobuf.IValue>|null} [values] ListValue values
             */

            /**
             * Constructs a new ListValue.
             * @memberof google.protobuf
             * @classdesc Represents a ListValue.
             * @implements IListValue
             * @constructor
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             */
            function ListValue(properties) {
                this.values = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListValue values.
             * @member {Array.<google.protobuf.IValue>} values
             * @memberof google.protobuf.ListValue
             * @instance
             */
            ListValue.prototype.values = $util.emptyArray;

            /**
             * Creates a new ListValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             * @returns {google.protobuf.ListValue} ListValue instance
             */
            ListValue.create = function create(properties) {
                return new ListValue(properties);
            };

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.values != null && message.values.length)
                    for (var i = 0; i < message.values.length; ++i)
                        $root.google.protobuf.Value.encode(message.values[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ListValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.values && message.values.length))
                            message.values = [];
                        message.values.push($root.google.protobuf.Value.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListValue message.
             * @function verify
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.values != null && message.hasOwnProperty("values")) {
                    if (!Array.isArray(message.values))
                        return "values: array expected";
                    for (var i = 0; i < message.values.length; ++i) {
                        var error = $root.google.protobuf.Value.verify(message.values[i]);
                        if (error)
                            return "values." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ListValue)
                    return object;
                var message = new $root.google.protobuf.ListValue();
                if (object.values) {
                    if (!Array.isArray(object.values))
                        throw TypeError(".google.protobuf.ListValue.values: array expected");
                    message.values = [];
                    for (var i = 0; i < object.values.length; ++i) {
                        if (typeof object.values[i] !== "object")
                            throw TypeError(".google.protobuf.ListValue.values: object expected");
                        message.values[i] = $root.google.protobuf.Value.fromObject(object.values[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.ListValue} message ListValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.values = [];
                if (message.values && message.values.length) {
                    object.values = [];
                    for (var j = 0; j < message.values.length; ++j)
                        object.values[j] = $root.google.protobuf.Value.toObject(message.values[j], options);
                }
                return object;
            };

            /**
             * Converts this ListValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.ListValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ListValue;
        })();

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.seconds = reader.int64();
                        break;
                    case 2:
                        message.nanos = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Timestamp;
        })();

        protobuf.DoubleValue = (function() {

            /**
             * Properties of a DoubleValue.
             * @memberof google.protobuf
             * @interface IDoubleValue
             * @property {number|null} [value] DoubleValue value
             */

            /**
             * Constructs a new DoubleValue.
             * @memberof google.protobuf
             * @classdesc Represents a DoubleValue.
             * @implements IDoubleValue
             * @constructor
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             */
            function DoubleValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DoubleValue value.
             * @member {number} value
             * @memberof google.protobuf.DoubleValue
             * @instance
             */
            DoubleValue.prototype.value = 0;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             * @returns {google.protobuf.DoubleValue} DoubleValue instance
             */
            DoubleValue.create = function create(properties) {
                return new DoubleValue(properties);
            };

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                return writer;
            };

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DoubleValue message.
             * @function verify
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DoubleValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DoubleValue} DoubleValue
             */
            DoubleValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.DoubleValue)
                    return object;
                var message = new $root.google.protobuf.DoubleValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.DoubleValue} message DoubleValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DoubleValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this DoubleValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.DoubleValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DoubleValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DoubleValue;
        })();

        protobuf.FloatValue = (function() {

            /**
             * Properties of a FloatValue.
             * @memberof google.protobuf
             * @interface IFloatValue
             * @property {number|null} [value] FloatValue value
             */

            /**
             * Constructs a new FloatValue.
             * @memberof google.protobuf
             * @classdesc Represents a FloatValue.
             * @implements IFloatValue
             * @constructor
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             */
            function FloatValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FloatValue value.
             * @member {number} value
             * @memberof google.protobuf.FloatValue
             * @instance
             */
            FloatValue.prototype.value = 0;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             * @returns {google.protobuf.FloatValue} FloatValue instance
             */
            FloatValue.create = function create(properties) {
                return new FloatValue(properties);
            };

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
                return writer;
            };

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FloatValue message.
             * @function verify
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FloatValue} FloatValue
             */
            FloatValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FloatValue)
                    return object;
                var message = new $root.google.protobuf.FloatValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.FloatValue} message FloatValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FloatValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this FloatValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.FloatValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FloatValue;
        })();

        protobuf.Int64Value = (function() {

            /**
             * Properties of an Int64Value.
             * @memberof google.protobuf
             * @interface IInt64Value
             * @property {number|Long|null} [value] Int64Value value
             */

            /**
             * Constructs a new Int64Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int64Value.
             * @implements IInt64Value
             * @constructor
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             */
            function Int64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.Int64Value
             * @instance
             */
            Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.Int64Value} Int64Value instance
             */
            Int64Value.create = function create(properties) {
                return new Int64Value(properties);
            };

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int64Value message.
             * @function verify
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int64Value} Int64Value
             */
            Int64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int64Value)
                    return object;
                var message = new $root.google.protobuf.Int64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.Int64Value} message Int64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                return object;
            };

            /**
             * Converts this Int64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int64Value;
        })();

        protobuf.UInt64Value = (function() {

            /**
             * Properties of a UInt64Value.
             * @memberof google.protobuf
             * @interface IUInt64Value
             * @property {number|Long|null} [value] UInt64Value value
             */

            /**
             * Constructs a new UInt64Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt64Value.
             * @implements IUInt64Value
             * @constructor
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             */
            function UInt64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.UInt64Value
             * @instance
             */
            UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt64Value} UInt64Value instance
             */
            UInt64Value.create = function create(properties) {
                return new UInt64Value(properties);
            };

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt64Value message.
             * @function verify
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt64Value} UInt64Value
             */
            UInt64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt64Value)
                    return object;
                var message = new $root.google.protobuf.UInt64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = true;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.UInt64Value} message UInt64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                return object;
            };

            /**
             * Converts this UInt64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt64Value;
        })();

        protobuf.Int32Value = (function() {

            /**
             * Properties of an Int32Value.
             * @memberof google.protobuf
             * @interface IInt32Value
             * @property {number|null} [value] Int32Value value
             */

            /**
             * Constructs a new Int32Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int32Value.
             * @implements IInt32Value
             * @constructor
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             */
            function Int32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int32Value value.
             * @member {number} value
             * @memberof google.protobuf.Int32Value
             * @instance
             */
            Int32Value.prototype.value = 0;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.Int32Value} Int32Value instance
             */
            Int32Value.create = function create(properties) {
                return new Int32Value(properties);
            };

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int32Value message.
             * @function verify
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int32Value} Int32Value
             */
            Int32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int32Value)
                    return object;
                var message = new $root.google.protobuf.Int32Value();
                if (object.value != null)
                    message.value = object.value | 0;
                return message;
            };

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.Int32Value} message Int32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Int32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int32Value;
        })();

        protobuf.UInt32Value = (function() {

            /**
             * Properties of a UInt32Value.
             * @memberof google.protobuf
             * @interface IUInt32Value
             * @property {number|null} [value] UInt32Value value
             */

            /**
             * Constructs a new UInt32Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt32Value.
             * @implements IUInt32Value
             * @constructor
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             */
            function UInt32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt32Value value.
             * @member {number} value
             * @memberof google.protobuf.UInt32Value
             * @instance
             */
            UInt32Value.prototype.value = 0;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt32Value} UInt32Value instance
             */
            UInt32Value.create = function create(properties) {
                return new UInt32Value(properties);
            };

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt32Value message.
             * @function verify
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt32Value} UInt32Value
             */
            UInt32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt32Value)
                    return object;
                var message = new $root.google.protobuf.UInt32Value();
                if (object.value != null)
                    message.value = object.value >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.UInt32Value} message UInt32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this UInt32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt32Value;
        })();

        protobuf.BoolValue = (function() {

            /**
             * Properties of a BoolValue.
             * @memberof google.protobuf
             * @interface IBoolValue
             * @property {boolean|null} [value] BoolValue value
             */

            /**
             * Constructs a new BoolValue.
             * @memberof google.protobuf
             * @classdesc Represents a BoolValue.
             * @implements IBoolValue
             * @constructor
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             */
            function BoolValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BoolValue value.
             * @member {boolean} value
             * @memberof google.protobuf.BoolValue
             * @instance
             */
            BoolValue.prototype.value = false;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             * @returns {google.protobuf.BoolValue} BoolValue instance
             */
            BoolValue.create = function create(properties) {
                return new BoolValue(properties);
            };

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                return writer;
            };

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BoolValue message.
             * @function verify
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BoolValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "boolean")
                        return "value: boolean expected";
                return null;
            };

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BoolValue} BoolValue
             */
            BoolValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BoolValue)
                    return object;
                var message = new $root.google.protobuf.BoolValue();
                if (object.value != null)
                    message.value = Boolean(object.value);
                return message;
            };

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.BoolValue} message BoolValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BoolValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = false;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this BoolValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BoolValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BoolValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BoolValue;
        })();

        protobuf.StringValue = (function() {

            /**
             * Properties of a StringValue.
             * @memberof google.protobuf
             * @interface IStringValue
             * @property {string|null} [value] StringValue value
             */

            /**
             * Constructs a new StringValue.
             * @memberof google.protobuf
             * @classdesc Represents a StringValue.
             * @implements IStringValue
             * @constructor
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             */
            function StringValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StringValue value.
             * @member {string} value
             * @memberof google.protobuf.StringValue
             * @instance
             */
            StringValue.prototype.value = "";

            /**
             * Creates a new StringValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             * @returns {google.protobuf.StringValue} StringValue instance
             */
            StringValue.create = function create(properties) {
                return new StringValue(properties);
            };

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StringValue message.
             * @function verify
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StringValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.StringValue} StringValue
             */
            StringValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.StringValue)
                    return object;
                var message = new $root.google.protobuf.StringValue();
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.StringValue} message StringValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StringValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = "";
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this StringValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.StringValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StringValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return StringValue;
        })();

        protobuf.BytesValue = (function() {

            /**
             * Properties of a BytesValue.
             * @memberof google.protobuf
             * @interface IBytesValue
             * @property {Uint8Array|null} [value] BytesValue value
             */

            /**
             * Constructs a new BytesValue.
             * @memberof google.protobuf
             * @classdesc Represents a BytesValue.
             * @implements IBytesValue
             * @constructor
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             */
            function BytesValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BytesValue value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.BytesValue
             * @instance
             */
            BytesValue.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             * @returns {google.protobuf.BytesValue} BytesValue instance
             */
            BytesValue.create = function create(properties) {
                return new BytesValue(properties);
            };

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BytesValue message.
             * @function verify
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytesValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BytesValue} BytesValue
             */
            BytesValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BytesValue)
                    return object;
                var message = new $root.google.protobuf.BytesValue();
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.BytesValue} message BytesValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytesValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = options.bytes === String ? "" : [];
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this BytesValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BytesValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytesValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BytesValue;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
