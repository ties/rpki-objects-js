import { AsnArray, AsnProp, AsnPropTypes, AsnSerializer, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

//  FileAndHash ::=     SEQUENCE {
//    file            IA5String,
//    hash            BIT STRING
//    }
class FileAndHash {
    @AsnProp({ type: AsnPropTypes.IA5String})
    public file: string = "";
    @AsnProp({ type: AsnPropTypes.BitString})
    public hash: ArrayBuffer = new ArrayBuffer(0);
}

@AsnType({ type: AsnTypeTypes.Sequence, itemType: FileAndHash })
class FileList extends AsnArray<FileAndHash> {

  constructor(items?: FileAndHash[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FileList.prototype);
  }

}
//   Manifest ::= SEQUENCE {
//    version     [0] INTEGER DEFAULT 0,
//    manifestNumber  INTEGER (0..MAX),
//    thisUpdate      GeneralizedTime,
//    nextUpdate      GeneralizedTime,
//    fileHashAlg     OBJECT IDENTIFIER,
//    fileList        SEQUENCE SIZE (0..MAX) OF FileAndHash
//    }

export class Manifest {
    @AsnProp({ type: AsnPropTypes.Integer, context: 0, defaultValue: 0 })
    public version: int = 0;
  
    @AsnProp({ type: AsnPropTypes.Integer })
    public manifestNumber: int;
  
    @AsnProp({ type: AsnPropTypes.GeneralizedTime })
    public thisUpdate: Date;
    
    @AsnProp({ type: AsnPropTypes.GeneralizedTime })
    public nextUpdate: Date;

    @AsnProp({ type: AsnPropTypes.ObjectIdentifier})
    public fileHashAlg: string; 
    
    @AsnProp({ type: FileList }) //, context: 0, implicit: true, optional: false })
    public fileList: FileList;

    constructor(params: Partial<Manifest> = {}) {
      Object.assign(this, params);
    }
  }