import * as $protobuf from "protobufjs";

/** Namespace featureflags. */
export namespace featureflags {

    /** Namespace backend. */
    namespace backend {

        /** Properties of an Id. */
        interface IId {

            /** Id value */
            value?: (string|null);
        }

        /** Represents an Id. */
        class Id implements IId {

            /**
             * Constructs a new Id.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IId);

            /** Id value. */
            public value: string;

            /**
             * Creates a new Id instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Id instance
             */
            public static create(properties?: featureflags.backend.IId): featureflags.backend.Id;

            /**
             * Encodes the specified Id message. Does not implicitly {@link featureflags.backend.Id.verify|verify} messages.
             * @param message Id message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Id message, length delimited. Does not implicitly {@link featureflags.backend.Id.verify|verify} messages.
             * @param message Id message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Id message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Id
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.Id;

            /**
             * Decodes an Id message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Id
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.Id;

            /**
             * Verifies an Id message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Id message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Id
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.Id;

            /**
             * Creates a plain object from an Id message. Also converts values to other types if specified.
             * @param message Id
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.Id, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Id to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a LocalId. */
        interface ILocalId {

            /** LocalId value */
            value?: (string|null);

            /** LocalId scope */
            scope?: (string|null);
        }

        /** Represents a LocalId. */
        class LocalId implements ILocalId {

            /**
             * Constructs a new LocalId.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.ILocalId);

            /** LocalId value. */
            public value: string;

            /** LocalId scope. */
            public scope: string;

            /**
             * Creates a new LocalId instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocalId instance
             */
            public static create(properties?: featureflags.backend.ILocalId): featureflags.backend.LocalId;

            /**
             * Encodes the specified LocalId message. Does not implicitly {@link featureflags.backend.LocalId.verify|verify} messages.
             * @param message LocalId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.ILocalId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocalId message, length delimited. Does not implicitly {@link featureflags.backend.LocalId.verify|verify} messages.
             * @param message LocalId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.ILocalId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocalId message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocalId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.LocalId;

            /**
             * Decodes a LocalId message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocalId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.LocalId;

            /**
             * Verifies a LocalId message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LocalId message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LocalId
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.LocalId;

            /**
             * Creates a plain object from a LocalId message. Also converts values to other types if specified.
             * @param message LocalId
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.LocalId, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LocalId to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EitherId. */
        interface IEitherId {

            /** EitherId id */
            id?: (featureflags.backend.IId|null);

            /** EitherId local_id */
            local_id?: (featureflags.backend.ILocalId|null);
        }

        /** Represents an EitherId. */
        class EitherId implements IEitherId {

            /**
             * Constructs a new EitherId.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IEitherId);

            /** EitherId id. */
            public id?: (featureflags.backend.IId|null);

            /** EitherId local_id. */
            public local_id?: (featureflags.backend.ILocalId|null);

            /** EitherId kind. */
            public kind?: ("id"|"local_id");

            /**
             * Creates a new EitherId instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EitherId instance
             */
            public static create(properties?: featureflags.backend.IEitherId): featureflags.backend.EitherId;

            /**
             * Encodes the specified EitherId message. Does not implicitly {@link featureflags.backend.EitherId.verify|verify} messages.
             * @param message EitherId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IEitherId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EitherId message, length delimited. Does not implicitly {@link featureflags.backend.EitherId.verify|verify} messages.
             * @param message EitherId message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IEitherId, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EitherId message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EitherId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.EitherId;

            /**
             * Decodes an EitherId message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EitherId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.EitherId;

            /**
             * Verifies an EitherId message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EitherId message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EitherId
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.EitherId;

            /**
             * Creates a plain object from an EitherId message. Also converts values to other types if specified.
             * @param message EitherId
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.EitherId, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EitherId to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SignIn. */
        interface ISignIn {

            /** SignIn username */
            username?: (string|null);

            /** SignIn password */
            password?: (string|null);
        }

        /** Represents a SignIn. */
        class SignIn implements ISignIn {

            /**
             * Constructs a new SignIn.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.ISignIn);

            /** SignIn username. */
            public username: string;

            /** SignIn password. */
            public password: string;

            /**
             * Creates a new SignIn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SignIn instance
             */
            public static create(properties?: featureflags.backend.ISignIn): featureflags.backend.SignIn;

            /**
             * Encodes the specified SignIn message. Does not implicitly {@link featureflags.backend.SignIn.verify|verify} messages.
             * @param message SignIn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.ISignIn, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SignIn message, length delimited. Does not implicitly {@link featureflags.backend.SignIn.verify|verify} messages.
             * @param message SignIn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.ISignIn, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SignIn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SignIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.SignIn;

            /**
             * Decodes a SignIn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SignIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.SignIn;

            /**
             * Verifies a SignIn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SignIn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SignIn
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.SignIn;

            /**
             * Creates a plain object from a SignIn message. Also converts values to other types if specified.
             * @param message SignIn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.SignIn, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SignIn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SignOut. */
        interface ISignOut {
        }

        /** Represents a SignOut. */
        class SignOut implements ISignOut {

            /**
             * Constructs a new SignOut.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.ISignOut);

            /**
             * Creates a new SignOut instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SignOut instance
             */
            public static create(properties?: featureflags.backend.ISignOut): featureflags.backend.SignOut;

            /**
             * Encodes the specified SignOut message. Does not implicitly {@link featureflags.backend.SignOut.verify|verify} messages.
             * @param message SignOut message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.ISignOut, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SignOut message, length delimited. Does not implicitly {@link featureflags.backend.SignOut.verify|verify} messages.
             * @param message SignOut message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.ISignOut, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SignOut message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SignOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.SignOut;

            /**
             * Decodes a SignOut message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SignOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.SignOut;

            /**
             * Verifies a SignOut message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SignOut message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SignOut
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.SignOut;

            /**
             * Creates a plain object from a SignOut message. Also converts values to other types if specified.
             * @param message SignOut
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.SignOut, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SignOut to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnableFlag. */
        interface IEnableFlag {

            /** EnableFlag flag_id */
            flag_id?: (featureflags.backend.IId|null);
        }

        /** Represents an EnableFlag. */
        class EnableFlag implements IEnableFlag {

            /**
             * Constructs a new EnableFlag.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IEnableFlag);

            /** EnableFlag flag_id. */
            public flag_id?: (featureflags.backend.IId|null);

            /**
             * Creates a new EnableFlag instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnableFlag instance
             */
            public static create(properties?: featureflags.backend.IEnableFlag): featureflags.backend.EnableFlag;

            /**
             * Encodes the specified EnableFlag message. Does not implicitly {@link featureflags.backend.EnableFlag.verify|verify} messages.
             * @param message EnableFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IEnableFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnableFlag message, length delimited. Does not implicitly {@link featureflags.backend.EnableFlag.verify|verify} messages.
             * @param message EnableFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IEnableFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnableFlag message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.EnableFlag;

            /**
             * Decodes an EnableFlag message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.EnableFlag;

            /**
             * Verifies an EnableFlag message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnableFlag message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnableFlag
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.EnableFlag;

            /**
             * Creates a plain object from an EnableFlag message. Also converts values to other types if specified.
             * @param message EnableFlag
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.EnableFlag, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnableFlag to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DisableFlag. */
        interface IDisableFlag {

            /** DisableFlag flag_id */
            flag_id?: (featureflags.backend.IId|null);
        }

        /** Represents a DisableFlag. */
        class DisableFlag implements IDisableFlag {

            /**
             * Constructs a new DisableFlag.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IDisableFlag);

            /** DisableFlag flag_id. */
            public flag_id?: (featureflags.backend.IId|null);

            /**
             * Creates a new DisableFlag instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisableFlag instance
             */
            public static create(properties?: featureflags.backend.IDisableFlag): featureflags.backend.DisableFlag;

            /**
             * Encodes the specified DisableFlag message. Does not implicitly {@link featureflags.backend.DisableFlag.verify|verify} messages.
             * @param message DisableFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IDisableFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisableFlag message, length delimited. Does not implicitly {@link featureflags.backend.DisableFlag.verify|verify} messages.
             * @param message DisableFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IDisableFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisableFlag message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.DisableFlag;

            /**
             * Decodes a DisableFlag message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisableFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.DisableFlag;

            /**
             * Verifies a DisableFlag message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisableFlag message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisableFlag
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.DisableFlag;

            /**
             * Creates a plain object from a DisableFlag message. Also converts values to other types if specified.
             * @param message DisableFlag
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.DisableFlag, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisableFlag to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ResetFlag. */
        interface IResetFlag {

            /** ResetFlag flag_id */
            flag_id?: (featureflags.backend.IId|null);
        }

        /** Represents a ResetFlag. */
        class ResetFlag implements IResetFlag {

            /**
             * Constructs a new ResetFlag.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IResetFlag);

            /** ResetFlag flag_id. */
            public flag_id?: (featureflags.backend.IId|null);

            /**
             * Creates a new ResetFlag instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResetFlag instance
             */
            public static create(properties?: featureflags.backend.IResetFlag): featureflags.backend.ResetFlag;

            /**
             * Encodes the specified ResetFlag message. Does not implicitly {@link featureflags.backend.ResetFlag.verify|verify} messages.
             * @param message ResetFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IResetFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResetFlag message, length delimited. Does not implicitly {@link featureflags.backend.ResetFlag.verify|verify} messages.
             * @param message ResetFlag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IResetFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResetFlag message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResetFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.ResetFlag;

            /**
             * Decodes a ResetFlag message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResetFlag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.ResetFlag;

            /**
             * Verifies a ResetFlag message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResetFlag message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResetFlag
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.ResetFlag;

            /**
             * Creates a plain object from a ResetFlag message. Also converts values to other types if specified.
             * @param message ResetFlag
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.ResetFlag, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResetFlag to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an AddCheck. */
        interface IAddCheck {

            /** AddCheck local_id */
            local_id?: (featureflags.backend.ILocalId|null);

            /** AddCheck variable */
            variable?: (featureflags.backend.IId|null);

            /** AddCheck operator */
            operator?: (featureflags.graph.Check.Operator|null);

            /** AddCheck value_string */
            value_string?: (string|null);

            /** AddCheck value_number */
            value_number?: (number|null);

            /** AddCheck value_timestamp */
            value_timestamp?: (google.protobuf.ITimestamp|null);

            /** AddCheck value_set */
            value_set?: (featureflags.graph.ISet|null);
        }

        /** Represents an AddCheck. */
        class AddCheck implements IAddCheck {

            /**
             * Constructs a new AddCheck.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IAddCheck);

            /** AddCheck local_id. */
            public local_id?: (featureflags.backend.ILocalId|null);

            /** AddCheck variable. */
            public variable?: (featureflags.backend.IId|null);

            /** AddCheck operator. */
            public operator: featureflags.graph.Check.Operator;

            /** AddCheck value_string. */
            public value_string: string;

            /** AddCheck value_number. */
            public value_number: number;

            /** AddCheck value_timestamp. */
            public value_timestamp?: (google.protobuf.ITimestamp|null);

            /** AddCheck value_set. */
            public value_set?: (featureflags.graph.ISet|null);

            /** AddCheck kind. */
            public kind?: ("value_string"|"value_number"|"value_timestamp"|"value_set");

            /**
             * Creates a new AddCheck instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AddCheck instance
             */
            public static create(properties?: featureflags.backend.IAddCheck): featureflags.backend.AddCheck;

            /**
             * Encodes the specified AddCheck message. Does not implicitly {@link featureflags.backend.AddCheck.verify|verify} messages.
             * @param message AddCheck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IAddCheck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AddCheck message, length delimited. Does not implicitly {@link featureflags.backend.AddCheck.verify|verify} messages.
             * @param message AddCheck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IAddCheck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AddCheck message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AddCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.AddCheck;

            /**
             * Decodes an AddCheck message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AddCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.AddCheck;

            /**
             * Verifies an AddCheck message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AddCheck message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AddCheck
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.AddCheck;

            /**
             * Creates a plain object from an AddCheck message. Also converts values to other types if specified.
             * @param message AddCheck
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.AddCheck, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AddCheck to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an AddCondition. */
        interface IAddCondition {

            /** AddCondition flag_id */
            flag_id?: (featureflags.backend.IId|null);

            /** AddCondition local_id */
            local_id?: (featureflags.backend.ILocalId|null);

            /** AddCondition checks */
            checks?: (featureflags.backend.IEitherId[]|null);
        }

        /** Represents an AddCondition. */
        class AddCondition implements IAddCondition {

            /**
             * Constructs a new AddCondition.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IAddCondition);

            /** AddCondition flag_id. */
            public flag_id?: (featureflags.backend.IId|null);

            /** AddCondition local_id. */
            public local_id?: (featureflags.backend.ILocalId|null);

            /** AddCondition checks. */
            public checks: featureflags.backend.IEitherId[];

            /**
             * Creates a new AddCondition instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AddCondition instance
             */
            public static create(properties?: featureflags.backend.IAddCondition): featureflags.backend.AddCondition;

            /**
             * Encodes the specified AddCondition message. Does not implicitly {@link featureflags.backend.AddCondition.verify|verify} messages.
             * @param message AddCondition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IAddCondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AddCondition message, length delimited. Does not implicitly {@link featureflags.backend.AddCondition.verify|verify} messages.
             * @param message AddCondition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IAddCondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AddCondition message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AddCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.AddCondition;

            /**
             * Decodes an AddCondition message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AddCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.AddCondition;

            /**
             * Verifies an AddCondition message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AddCondition message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AddCondition
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.AddCondition;

            /**
             * Creates a plain object from an AddCondition message. Also converts values to other types if specified.
             * @param message AddCondition
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.AddCondition, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AddCondition to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DisableCondition. */
        interface IDisableCondition {

            /** DisableCondition condition_id */
            condition_id?: (featureflags.backend.IId|null);
        }

        /** Represents a DisableCondition. */
        class DisableCondition implements IDisableCondition {

            /**
             * Constructs a new DisableCondition.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IDisableCondition);

            /** DisableCondition condition_id. */
            public condition_id?: (featureflags.backend.IId|null);

            /**
             * Creates a new DisableCondition instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisableCondition instance
             */
            public static create(properties?: featureflags.backend.IDisableCondition): featureflags.backend.DisableCondition;

            /**
             * Encodes the specified DisableCondition message. Does not implicitly {@link featureflags.backend.DisableCondition.verify|verify} messages.
             * @param message DisableCondition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IDisableCondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisableCondition message, length delimited. Does not implicitly {@link featureflags.backend.DisableCondition.verify|verify} messages.
             * @param message DisableCondition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IDisableCondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisableCondition message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisableCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.DisableCondition;

            /**
             * Decodes a DisableCondition message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisableCondition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.DisableCondition;

            /**
             * Verifies a DisableCondition message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisableCondition message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisableCondition
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.DisableCondition;

            /**
             * Creates a plain object from a DisableCondition message. Also converts values to other types if specified.
             * @param message DisableCondition
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.DisableCondition, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisableCondition to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Operation. */
        interface IOperation {

            /** Operation enable_flag */
            enable_flag?: (featureflags.backend.IEnableFlag|null);

            /** Operation disable_flag */
            disable_flag?: (featureflags.backend.IDisableFlag|null);

            /** Operation add_condition */
            add_condition?: (featureflags.backend.IAddCondition|null);

            /** Operation disable_condition */
            disable_condition?: (featureflags.backend.IDisableCondition|null);

            /** Operation add_check */
            add_check?: (featureflags.backend.IAddCheck|null);

            /** Operation reset_flag */
            reset_flag?: (featureflags.backend.IResetFlag|null);

            /** Operation sign_in */
            sign_in?: (featureflags.backend.ISignIn|null);

            /** Operation sign_out */
            sign_out?: (featureflags.backend.ISignOut|null);
        }

        /** Represents an Operation. */
        class Operation implements IOperation {

            /**
             * Constructs a new Operation.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IOperation);

            /** Operation enable_flag. */
            public enable_flag?: (featureflags.backend.IEnableFlag|null);

            /** Operation disable_flag. */
            public disable_flag?: (featureflags.backend.IDisableFlag|null);

            /** Operation add_condition. */
            public add_condition?: (featureflags.backend.IAddCondition|null);

            /** Operation disable_condition. */
            public disable_condition?: (featureflags.backend.IDisableCondition|null);

            /** Operation add_check. */
            public add_check?: (featureflags.backend.IAddCheck|null);

            /** Operation reset_flag. */
            public reset_flag?: (featureflags.backend.IResetFlag|null);

            /** Operation sign_in. */
            public sign_in?: (featureflags.backend.ISignIn|null);

            /** Operation sign_out. */
            public sign_out?: (featureflags.backend.ISignOut|null);

            /** Operation op. */
            public op?: ("enable_flag"|"disable_flag"|"add_condition"|"disable_condition"|"add_check"|"reset_flag"|"sign_in"|"sign_out");

            /**
             * Creates a new Operation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Operation instance
             */
            public static create(properties?: featureflags.backend.IOperation): featureflags.backend.Operation;

            /**
             * Encodes the specified Operation message. Does not implicitly {@link featureflags.backend.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Operation message, length delimited. Does not implicitly {@link featureflags.backend.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Operation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.Operation;

            /**
             * Decodes an Operation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.Operation;

            /**
             * Verifies an Operation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Operation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Operation
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.Operation;

            /**
             * Creates a plain object from an Operation message. Also converts values to other types if specified.
             * @param message Operation
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.Operation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Operation to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Request. */
        interface IRequest {

            /** Request operations */
            operations?: (featureflags.backend.IOperation[]|null);

            /** Request query */
            query?: (hiku.protobuf.query.INode|null);
        }

        /** Represents a Request. */
        class Request implements IRequest {

            /**
             * Constructs a new Request.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IRequest);

            /** Request operations. */
            public operations: featureflags.backend.IOperation[];

            /** Request query. */
            public query?: (hiku.protobuf.query.INode|null);

            /**
             * Creates a new Request instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Request instance
             */
            public static create(properties?: featureflags.backend.IRequest): featureflags.backend.Request;

            /**
             * Encodes the specified Request message. Does not implicitly {@link featureflags.backend.Request.verify|verify} messages.
             * @param message Request message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Request message, length delimited. Does not implicitly {@link featureflags.backend.Request.verify|verify} messages.
             * @param message Request message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Request message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.Request;

            /**
             * Decodes a Request message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.Request;

            /**
             * Verifies a Request message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Request message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Request
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.Request;

            /**
             * Creates a plain object from a Request message. Also converts values to other types if specified.
             * @param message Request
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Request to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Reply. */
        interface IReply {

            /** Reply result */
            result?: (featureflags.graph.IResult|null);
        }

        /** Represents a Reply. */
        class Reply implements IReply {

            /**
             * Constructs a new Reply.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.backend.IReply);

            /** Reply result. */
            public result?: (featureflags.graph.IResult|null);

            /**
             * Creates a new Reply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Reply instance
             */
            public static create(properties?: featureflags.backend.IReply): featureflags.backend.Reply;

            /**
             * Encodes the specified Reply message. Does not implicitly {@link featureflags.backend.Reply.verify|verify} messages.
             * @param message Reply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.backend.IReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Reply message, length delimited. Does not implicitly {@link featureflags.backend.Reply.verify|verify} messages.
             * @param message Reply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.backend.IReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Reply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Reply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.backend.Reply;

            /**
             * Decodes a Reply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Reply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.backend.Reply;

            /**
             * Verifies a Reply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Reply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Reply
             */
            public static fromObject(object: { [k: string]: any }): featureflags.backend.Reply;

            /**
             * Creates a plain object from a Reply message. Also converts values to other types if specified.
             * @param message Reply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.backend.Reply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Reply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Represents a Backend */
        class Backend extends $protobuf.rpc.Service {

            /**
             * Constructs a new Backend service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new Backend service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Backend;

            /**
             * Calls call.
             * @param request Request message or plain object
             * @param callback Node-style callback called with the error, if any, and Reply
             */
            public call(request: featureflags.backend.IRequest, callback: featureflags.backend.Backend.callCallback): void;

            /**
             * Calls call.
             * @param request Request message or plain object
             * @returns Promise
             */
            public call(request: featureflags.backend.IRequest): Promise<featureflags.backend.Reply>;
        }

        namespace Backend {

            /**
             * Callback as used by {@link featureflags.backend.Backend#call}.
             * @param error Error, if any
             * @param [response] Reply
             */
            type callCallback = (error: (Error|null), response?: featureflags.backend.Reply) => void;

            /**
             * Callback as used by {@link featureflags.backend.Backend#call}.
             * @param error Error, if any
             * @param [response] Reply
             */
            type CallCallback = (error: (Error|null), response?: featureflags.backend.Reply) => void;
        }
    }

    /** Namespace graph. */
    namespace graph {

        /** Properties of a Ref. */
        interface IRef {

            /** Ref Project */
            Project?: (string|null);

            /** Ref Flag */
            Flag?: (string|null);

            /** Ref Condition */
            Condition?: (string|null);

            /** Ref Check */
            Check?: (string|null);

            /** Ref Variable */
            Variable?: (string|null);
        }

        /** Represents a Ref. */
        class Ref implements IRef {

            /**
             * Constructs a new Ref.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IRef);

            /** Ref Project. */
            public Project: string;

            /** Ref Flag. */
            public Flag: string;

            /** Ref Condition. */
            public Condition: string;

            /** Ref Check. */
            public Check: string;

            /** Ref Variable. */
            public Variable: string;

            /** Ref to. */
            public to?: ("Project"|"Flag"|"Condition"|"Check"|"Variable");

            /**
             * Creates a new Ref instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Ref instance
             */
            public static create(properties?: featureflags.graph.IRef): featureflags.graph.Ref;

            /**
             * Encodes the specified Ref message. Does not implicitly {@link featureflags.graph.Ref.verify|verify} messages.
             * @param message Ref message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IRef, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Ref message, length delimited. Does not implicitly {@link featureflags.graph.Ref.verify|verify} messages.
             * @param message Ref message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IRef, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Ref message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Ref
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Ref;

            /**
             * Decodes a Ref message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Ref
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Ref;

            /**
             * Verifies a Ref message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Ref message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Ref
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Ref;

            /**
             * Creates a plain object from a Ref message. Also converts values to other types if specified.
             * @param message Ref
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Ref, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Ref to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Set. */
        interface ISet {

            /** Set items */
            items?: (string[]|null);
        }

        /** Represents a Set. */
        class Set implements ISet {

            /**
             * Constructs a new Set.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.ISet);

            /** Set items. */
            public items: string[];

            /**
             * Creates a new Set instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Set instance
             */
            public static create(properties?: featureflags.graph.ISet): featureflags.graph.Set;

            /**
             * Encodes the specified Set message. Does not implicitly {@link featureflags.graph.Set.verify|verify} messages.
             * @param message Set message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.ISet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Set message, length delimited. Does not implicitly {@link featureflags.graph.Set.verify|verify} messages.
             * @param message Set message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.ISet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Set message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Set
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Set;

            /**
             * Decodes a Set message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Set
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Set;

            /**
             * Verifies a Set message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Set message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Set
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Set;

            /**
             * Creates a plain object from a Set message. Also converts values to other types if specified.
             * @param message Set
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Set, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Set to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Variable. */
        interface IVariable {

            /** Variable id */
            id?: (string|null);

            /** Variable name */
            name?: (string|null);

            /** Variable type */
            type?: (featureflags.graph.Variable.Type|null);
        }

        /** Represents a Variable. */
        class Variable implements IVariable {

            /**
             * Constructs a new Variable.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IVariable);

            /** Variable id. */
            public id: string;

            /** Variable name. */
            public name: string;

            /** Variable type. */
            public type: featureflags.graph.Variable.Type;

            /**
             * Creates a new Variable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Variable instance
             */
            public static create(properties?: featureflags.graph.IVariable): featureflags.graph.Variable;

            /**
             * Encodes the specified Variable message. Does not implicitly {@link featureflags.graph.Variable.verify|verify} messages.
             * @param message Variable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IVariable, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Variable message, length delimited. Does not implicitly {@link featureflags.graph.Variable.verify|verify} messages.
             * @param message Variable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IVariable, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Variable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Variable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Variable;

            /**
             * Decodes a Variable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Variable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Variable;

            /**
             * Verifies a Variable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Variable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Variable
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Variable;

            /**
             * Creates a plain object from a Variable message. Also converts values to other types if specified.
             * @param message Variable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Variable, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Variable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Variable {

            /** Type enum. */
            enum Type {
                __DEFAULT__ = 0,
                STRING = 1,
                NUMBER = 2,
                TIMESTAMP = 3,
                SET = 4
            }
        }

        /** Properties of a Check. */
        interface ICheck {

            /** Check id */
            id?: (string|null);

            /** Check variable */
            variable?: (featureflags.graph.IRef|null);

            /** Check operator */
            operator?: (featureflags.graph.Check.Operator|null);

            /** Check value_string */
            value_string?: (string|null);

            /** Check value_number */
            value_number?: (number|null);

            /** Check value_timestamp */
            value_timestamp?: (google.protobuf.ITimestamp|null);

            /** Check value_set */
            value_set?: (featureflags.graph.ISet|null);
        }

        /** Represents a Check. */
        class Check implements ICheck {

            /**
             * Constructs a new Check.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.ICheck);

            /** Check id. */
            public id: string;

            /** Check variable. */
            public variable?: (featureflags.graph.IRef|null);

            /** Check operator. */
            public operator: featureflags.graph.Check.Operator;

            /** Check value_string. */
            public value_string: string;

            /** Check value_number. */
            public value_number: number;

            /** Check value_timestamp. */
            public value_timestamp?: (google.protobuf.ITimestamp|null);

            /** Check value_set. */
            public value_set?: (featureflags.graph.ISet|null);

            /** Check kind. */
            public kind?: ("value_string"|"value_number"|"value_timestamp"|"value_set");

            /**
             * Creates a new Check instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Check instance
             */
            public static create(properties?: featureflags.graph.ICheck): featureflags.graph.Check;

            /**
             * Encodes the specified Check message. Does not implicitly {@link featureflags.graph.Check.verify|verify} messages.
             * @param message Check message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.ICheck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Check message, length delimited. Does not implicitly {@link featureflags.graph.Check.verify|verify} messages.
             * @param message Check message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.ICheck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Check message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Check
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Check;

            /**
             * Decodes a Check message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Check
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Check;

            /**
             * Verifies a Check message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Check message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Check
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Check;

            /**
             * Creates a plain object from a Check message. Also converts values to other types if specified.
             * @param message Check
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Check, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Check to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Check {

            /** Operator enum. */
            enum Operator {
                __DEFAULT__ = 0,
                EQUAL = 1,
                LESS_THAN = 2,
                LESS_OR_EQUAL = 3,
                GREATER_THAN = 4,
                GREATER_OR_EQUAL = 5,
                CONTAINS = 6,
                PERCENT = 7,
                REGEXP = 8,
                WILDCARD = 9,
                SUBSET = 10,
                SUPERSET = 11
            }
        }

        /** Properties of a Condition. */
        interface ICondition {

            /** Condition id */
            id?: (string|null);

            /** Condition checks */
            checks?: (featureflags.graph.IRef[]|null);
        }

        /** Represents a Condition. */
        class Condition implements ICondition {

            /**
             * Constructs a new Condition.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.ICondition);

            /** Condition id. */
            public id: string;

            /** Condition checks. */
            public checks: featureflags.graph.IRef[];

            /**
             * Creates a new Condition instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Condition instance
             */
            public static create(properties?: featureflags.graph.ICondition): featureflags.graph.Condition;

            /**
             * Encodes the specified Condition message. Does not implicitly {@link featureflags.graph.Condition.verify|verify} messages.
             * @param message Condition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.ICondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Condition message, length delimited. Does not implicitly {@link featureflags.graph.Condition.verify|verify} messages.
             * @param message Condition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.ICondition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Condition message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Condition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Condition;

            /**
             * Decodes a Condition message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Condition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Condition;

            /**
             * Verifies a Condition message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Condition message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Condition
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Condition;

            /**
             * Creates a plain object from a Condition message. Also converts values to other types if specified.
             * @param message Condition
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Condition, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Condition to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Flag. */
        interface IFlag {

            /** Flag id */
            id?: (string|null);

            /** Flag name */
            name?: (string|null);

            /** Flag project */
            project?: (featureflags.graph.IRef|null);

            /** Flag enabled */
            enabled?: (google.protobuf.IBoolValue|null);

            /** Flag conditions */
            conditions?: (featureflags.graph.IRef[]|null);

            /** Flag overridden */
            overridden?: (google.protobuf.IBoolValue|null);
        }

        /** Represents a Flag. */
        class Flag implements IFlag {

            /**
             * Constructs a new Flag.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IFlag);

            /** Flag id. */
            public id: string;

            /** Flag name. */
            public name: string;

            /** Flag project. */
            public project?: (featureflags.graph.IRef|null);

            /** Flag enabled. */
            public enabled?: (google.protobuf.IBoolValue|null);

            /** Flag conditions. */
            public conditions: featureflags.graph.IRef[];

            /** Flag overridden. */
            public overridden?: (google.protobuf.IBoolValue|null);

            /**
             * Creates a new Flag instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Flag instance
             */
            public static create(properties?: featureflags.graph.IFlag): featureflags.graph.Flag;

            /**
             * Encodes the specified Flag message. Does not implicitly {@link featureflags.graph.Flag.verify|verify} messages.
             * @param message Flag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Flag message, length delimited. Does not implicitly {@link featureflags.graph.Flag.verify|verify} messages.
             * @param message Flag message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IFlag, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Flag message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Flag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Flag;

            /**
             * Decodes a Flag message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Flag
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Flag;

            /**
             * Verifies a Flag message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Flag message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Flag
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Flag;

            /**
             * Creates a plain object from a Flag message. Also converts values to other types if specified.
             * @param message Flag
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Flag, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Flag to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Project. */
        interface IProject {

            /** Project id */
            id?: (string|null);

            /** Project name */
            name?: (string|null);

            /** Project version */
            version?: (number|null);

            /** Project variables */
            variables?: (featureflags.graph.IRef[]|null);
        }

        /** Represents a Project. */
        class Project implements IProject {

            /**
             * Constructs a new Project.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IProject);

            /** Project id. */
            public id: string;

            /** Project name. */
            public name: string;

            /** Project version. */
            public version: number;

            /** Project variables. */
            public variables: featureflags.graph.IRef[];

            /**
             * Creates a new Project instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Project instance
             */
            public static create(properties?: featureflags.graph.IProject): featureflags.graph.Project;

            /**
             * Encodes the specified Project message. Does not implicitly {@link featureflags.graph.Project.verify|verify} messages.
             * @param message Project message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IProject, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Project message, length delimited. Does not implicitly {@link featureflags.graph.Project.verify|verify} messages.
             * @param message Project message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IProject, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Project message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Project
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Project;

            /**
             * Decodes a Project message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Project
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Project;

            /**
             * Verifies a Project message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Project message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Project
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Project;

            /**
             * Creates a plain object from a Project message. Also converts values to other types if specified.
             * @param message Project
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Project, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Project to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Root. */
        interface IRoot {

            /** Root flag */
            flag?: (featureflags.graph.IRef|null);

            /** Root flags */
            flags?: (featureflags.graph.IRef[]|null);

            /** Root projects */
            projects?: (featureflags.graph.IRef[]|null);

            /** Root authenticated */
            authenticated?: (boolean|null);

            /** Root flags_by_ids */
            flags_by_ids?: (featureflags.graph.IRef[]|null);
        }

        /** Represents a Root. */
        class Root implements IRoot {

            /**
             * Constructs a new Root.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IRoot);

            /** Root flag. */
            public flag?: (featureflags.graph.IRef|null);

            /** Root flags. */
            public flags: featureflags.graph.IRef[];

            /** Root projects. */
            public projects: featureflags.graph.IRef[];

            /** Root authenticated. */
            public authenticated: boolean;

            /** Root flags_by_ids. */
            public flags_by_ids: featureflags.graph.IRef[];

            /**
             * Creates a new Root instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Root instance
             */
            public static create(properties?: featureflags.graph.IRoot): featureflags.graph.Root;

            /**
             * Encodes the specified Root message. Does not implicitly {@link featureflags.graph.Root.verify|verify} messages.
             * @param message Root message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IRoot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Root message, length delimited. Does not implicitly {@link featureflags.graph.Root.verify|verify} messages.
             * @param message Root message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IRoot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Root message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Root
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Root;

            /**
             * Decodes a Root message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Root
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Root;

            /**
             * Verifies a Root message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Root message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Root
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Root;

            /**
             * Creates a plain object from a Root message. Also converts values to other types if specified.
             * @param message Root
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Root, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Root to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Result. */
        interface IResult {

            /** Result Root */
            Root?: (featureflags.graph.IRoot|null);

            /** Result Project */
            Project?: ({ [k: string]: featureflags.graph.IProject }|null);

            /** Result Flag */
            Flag?: ({ [k: string]: featureflags.graph.IFlag }|null);

            /** Result Condition */
            Condition?: ({ [k: string]: featureflags.graph.ICondition }|null);

            /** Result Check */
            Check?: ({ [k: string]: featureflags.graph.ICheck }|null);

            /** Result Variable */
            Variable?: ({ [k: string]: featureflags.graph.IVariable }|null);
        }

        /** Represents a Result. */
        class Result implements IResult {

            /**
             * Constructs a new Result.
             * @param [properties] Properties to set
             */
            constructor(properties?: featureflags.graph.IResult);

            /** Result Root. */
            public Root?: (featureflags.graph.IRoot|null);

            /** Result Project. */
            public Project: { [k: string]: featureflags.graph.IProject };

            /** Result Flag. */
            public Flag: { [k: string]: featureflags.graph.IFlag };

            /** Result Condition. */
            public Condition: { [k: string]: featureflags.graph.ICondition };

            /** Result Check. */
            public Check: { [k: string]: featureflags.graph.ICheck };

            /** Result Variable. */
            public Variable: { [k: string]: featureflags.graph.IVariable };

            /**
             * Creates a new Result instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Result instance
             */
            public static create(properties?: featureflags.graph.IResult): featureflags.graph.Result;

            /**
             * Encodes the specified Result message. Does not implicitly {@link featureflags.graph.Result.verify|verify} messages.
             * @param message Result message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: featureflags.graph.IResult, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Result message, length delimited. Does not implicitly {@link featureflags.graph.Result.verify|verify} messages.
             * @param message Result message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: featureflags.graph.IResult, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Result message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): featureflags.graph.Result;

            /**
             * Decodes a Result message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): featureflags.graph.Result;

            /**
             * Verifies a Result message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Result message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Result
             */
            public static fromObject(object: { [k: string]: any }): featureflags.graph.Result;

            /**
             * Creates a plain object from a Result message. Also converts values to other types if specified.
             * @param message Result
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: featureflags.graph.Result, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Result to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Namespace hiku. */
export namespace hiku {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Namespace query. */
        namespace query {

            /** Properties of a Field. */
            interface IField {

                /** Field name */
                name?: (string|null);

                /** Field options */
                options?: (google.protobuf.IStruct|null);
            }

            /** Represents a Field. */
            class Field implements IField {

                /**
                 * Constructs a new Field.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: hiku.protobuf.query.IField);

                /** Field name. */
                public name: string;

                /** Field options. */
                public options?: (google.protobuf.IStruct|null);

                /**
                 * Creates a new Field instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Field instance
                 */
                public static create(properties?: hiku.protobuf.query.IField): hiku.protobuf.query.Field;

                /**
                 * Encodes the specified Field message. Does not implicitly {@link hiku.protobuf.query.Field.verify|verify} messages.
                 * @param message Field message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: hiku.protobuf.query.IField, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Field message, length delimited. Does not implicitly {@link hiku.protobuf.query.Field.verify|verify} messages.
                 * @param message Field message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: hiku.protobuf.query.IField, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Field message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Field
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hiku.protobuf.query.Field;

                /**
                 * Decodes a Field message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Field
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hiku.protobuf.query.Field;

                /**
                 * Verifies a Field message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Field message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Field
                 */
                public static fromObject(object: { [k: string]: any }): hiku.protobuf.query.Field;

                /**
                 * Creates a plain object from a Field message. Also converts values to other types if specified.
                 * @param message Field
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: hiku.protobuf.query.Field, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Field to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Link. */
            interface ILink {

                /** Link name */
                name?: (string|null);

                /** Link node */
                node?: (hiku.protobuf.query.INode|null);

                /** Link options */
                options?: (google.protobuf.IStruct|null);
            }

            /** Represents a Link. */
            class Link implements ILink {

                /**
                 * Constructs a new Link.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: hiku.protobuf.query.ILink);

                /** Link name. */
                public name: string;

                /** Link node. */
                public node?: (hiku.protobuf.query.INode|null);

                /** Link options. */
                public options?: (google.protobuf.IStruct|null);

                /**
                 * Creates a new Link instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Link instance
                 */
                public static create(properties?: hiku.protobuf.query.ILink): hiku.protobuf.query.Link;

                /**
                 * Encodes the specified Link message. Does not implicitly {@link hiku.protobuf.query.Link.verify|verify} messages.
                 * @param message Link message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: hiku.protobuf.query.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Link message, length delimited. Does not implicitly {@link hiku.protobuf.query.Link.verify|verify} messages.
                 * @param message Link message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: hiku.protobuf.query.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Link message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hiku.protobuf.query.Link;

                /**
                 * Decodes a Link message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hiku.protobuf.query.Link;

                /**
                 * Verifies a Link message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Link message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Link
                 */
                public static fromObject(object: { [k: string]: any }): hiku.protobuf.query.Link;

                /**
                 * Creates a plain object from a Link message. Also converts values to other types if specified.
                 * @param message Link
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: hiku.protobuf.query.Link, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Link to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Item. */
            interface IItem {

                /** Item field */
                field?: (hiku.protobuf.query.IField|null);

                /** Item link */
                link?: (hiku.protobuf.query.ILink|null);
            }

            /** Represents an Item. */
            class Item implements IItem {

                /**
                 * Constructs a new Item.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: hiku.protobuf.query.IItem);

                /** Item field. */
                public field?: (hiku.protobuf.query.IField|null);

                /** Item link. */
                public link?: (hiku.protobuf.query.ILink|null);

                /** Item value. */
                public value?: ("field"|"link");

                /**
                 * Creates a new Item instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Item instance
                 */
                public static create(properties?: hiku.protobuf.query.IItem): hiku.protobuf.query.Item;

                /**
                 * Encodes the specified Item message. Does not implicitly {@link hiku.protobuf.query.Item.verify|verify} messages.
                 * @param message Item message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: hiku.protobuf.query.IItem, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Item message, length delimited. Does not implicitly {@link hiku.protobuf.query.Item.verify|verify} messages.
                 * @param message Item message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: hiku.protobuf.query.IItem, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Item message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Item
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hiku.protobuf.query.Item;

                /**
                 * Decodes an Item message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Item
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hiku.protobuf.query.Item;

                /**
                 * Verifies an Item message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Item message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Item
                 */
                public static fromObject(object: { [k: string]: any }): hiku.protobuf.query.Item;

                /**
                 * Creates a plain object from an Item message. Also converts values to other types if specified.
                 * @param message Item
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: hiku.protobuf.query.Item, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Item to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Node. */
            interface INode {

                /** Node items */
                items?: (hiku.protobuf.query.IItem[]|null);
            }

            /** Represents a Node. */
            class Node implements INode {

                /**
                 * Constructs a new Node.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: hiku.protobuf.query.INode);

                /** Node items. */
                public items: hiku.protobuf.query.IItem[];

                /**
                 * Creates a new Node instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Node instance
                 */
                public static create(properties?: hiku.protobuf.query.INode): hiku.protobuf.query.Node;

                /**
                 * Encodes the specified Node message. Does not implicitly {@link hiku.protobuf.query.Node.verify|verify} messages.
                 * @param message Node message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: hiku.protobuf.query.INode, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Node message, length delimited. Does not implicitly {@link hiku.protobuf.query.Node.verify|verify} messages.
                 * @param message Node message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: hiku.protobuf.query.INode, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Node message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Node
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hiku.protobuf.query.Node;

                /**
                 * Decodes a Node message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Node
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hiku.protobuf.query.Node;

                /**
                 * Verifies a Node message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Node message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Node
                 */
                public static fromObject(object: { [k: string]: any }): hiku.protobuf.query.Node;

                /**
                 * Creates a plain object from a Node message. Also converts values to other types if specified.
                 * @param message Node
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: hiku.protobuf.query.Node, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Node to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Struct. */
        interface IStruct {

            /** Struct fields */
            fields?: ({ [k: string]: google.protobuf.IValue }|null);
        }

        /** Represents a Struct. */
        class Struct implements IStruct {

            /**
             * Constructs a new Struct.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStruct);

            /** Struct fields. */
            public fields: { [k: string]: google.protobuf.IValue };

            /**
             * Creates a new Struct instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Struct instance
             */
            public static create(properties?: google.protobuf.IStruct): google.protobuf.Struct;

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Struct;

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Struct;

            /**
             * Verifies a Struct message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Struct
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Struct;

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @param message Struct
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Struct, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Struct to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Value. */
        interface IValue {

            /** Value nullValue */
            nullValue?: (google.protobuf.NullValue|null);

            /** Value numberValue */
            numberValue?: (number|null);

            /** Value stringValue */
            stringValue?: (string|null);

            /** Value boolValue */
            boolValue?: (boolean|null);

            /** Value structValue */
            structValue?: (google.protobuf.IStruct|null);

            /** Value listValue */
            listValue?: (google.protobuf.IListValue|null);
        }

        /** Represents a Value. */
        class Value implements IValue {

            /**
             * Constructs a new Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IValue);

            /** Value nullValue. */
            public nullValue: google.protobuf.NullValue;

            /** Value numberValue. */
            public numberValue: number;

            /** Value stringValue. */
            public stringValue: string;

            /** Value boolValue. */
            public boolValue: boolean;

            /** Value structValue. */
            public structValue?: (google.protobuf.IStruct|null);

            /** Value listValue. */
            public listValue?: (google.protobuf.IListValue|null);

            /** Value kind. */
            public kind?: ("nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue");

            /**
             * Creates a new Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Value instance
             */
            public static create(properties?: google.protobuf.IValue): google.protobuf.Value;

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Value;

            /**
             * Verifies a Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param message Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** NullValue enum. */
        enum NullValue {
            NULL_VALUE = 0
        }

        /** Properties of a ListValue. */
        interface IListValue {

            /** ListValue values */
            values?: (google.protobuf.IValue[]|null);
        }

        /** Represents a ListValue. */
        class ListValue implements IListValue {

            /**
             * Constructs a new ListValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IListValue);

            /** ListValue values. */
            public values: google.protobuf.IValue[];

            /**
             * Creates a new ListValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListValue instance
             */
            public static create(properties?: google.protobuf.IListValue): google.protobuf.ListValue;

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ListValue;

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ListValue;

            /**
             * Verifies a ListValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ListValue;

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @param message ListValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ListValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DoubleValue instance
             */
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;

            /**
             * Verifies a DoubleValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DoubleValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @param message DoubleValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DoubleValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatValue instance
             */
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;

            /**
             * Verifies a FloatValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @param message FloatValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|Long|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: (number|Long);

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int64Value instance
             */
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;

            /**
             * Verifies an Int64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @param message Int64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|Long|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: (number|Long);

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt64Value instance
             */
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;

            /**
             * Verifies a UInt64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @param message UInt64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int32Value instance
             */
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;

            /**
             * Verifies an Int32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @param message Int32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt32Value instance
             */
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;

            /**
             * Verifies a UInt32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @param message UInt32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BoolValue instance
             */
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;

            /**
             * Verifies a BoolValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BoolValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @param message BoolValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BoolValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;

            /**
             * Creates a new StringValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StringValue instance
             */
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;

            /**
             * Verifies a StringValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StringValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @param message StringValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StringValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BytesValue instance
             */
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;

            /**
             * Verifies a BytesValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BytesValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @param message BytesValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BytesValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
