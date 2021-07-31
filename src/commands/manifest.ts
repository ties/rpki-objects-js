import * as fs from 'fs';

import {Command, flags} from '@oclif/command'

import { AsnConvert, AsnParser } from "@peculiar/asn1-schema";
import { ContentInfo, SignedData } from "@peculiar/asn1-cms";

import { Manifest as ManifestSchema } from '../schema/rfc6486';


export default class Manifest extends Command {
  static description = 'parse a manifest'

  static examples = [
    `$ parse-object manifest RIPE-NCC-TEST.mft
    ...
`,
  ]

  static flags = {
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Manifest)
    console.log(args, flags);
    
    const rpkiMftBuffer = fs.readFileSync(args.file);

    const contentInfo = AsnConvert.parse(rpkiMftBuffer, ContentInfo);
    const signedData = AsnConvert.parse(contentInfo.content, SignedData);

    console.log(signedData);

    const eContent = signedData.encapContentInfo.eContent;
    if (eContent && eContent.single) {
      try {
        fs.writeFileSync("content.bin", Buffer.from(eContent.single.buffer));
        const manifest = AsnConvert.parse(Buffer.from(eContent.single.buffer), ManifestSchema);
        console.log(manifest);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("No eContent");
    }
  }
}

