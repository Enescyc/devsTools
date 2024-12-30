import { v1, v4, v5, validate, NIL, version as getVersion, parse } from 'uuid';

export type UuidVersion = 'v1' | 'v4' | 'v5' | 'nil';

export interface IUuidService {
  generate(version: UuidVersion, namespace?: string, name?: string): string;
  validate(uuid: string): boolean;
  getInfo(uuid: string): UuidInfo;
  generateBulk(count: number, version: UuidVersion, namespace?: string, name?: string): string[];
  getTimestamp(uuid: string): Date | null;
  generateSequential(count: number, startTime?: Date): string[];
}

export interface UuidInfo {
  isValid: boolean;
  version: number | null;
  variant: number | null;
  isNil: boolean;
  timestamp?: Date | null;
}

export class UuidService implements IUuidService {
  generate(version: UuidVersion, namespace?: string, name?: string): string {
    switch (version) {
      case 'v1':
        return v1();
      case 'v4':
        return v4();
      case 'v5':
        if (!namespace || !name) {
          throw new Error('Namespace and name are required for UUID v5');
        }
        return v5(name, namespace);
      case 'nil':
        return NIL;
      default:
        throw new Error('Invalid UUID version');
    }
  }

  validate(uuid: string): boolean {
    return validate(uuid);
  }

  getInfo(uuid: string): UuidInfo {
    const isValid = this.validate(uuid);
    const isNil = uuid === NIL;
    
    let version = null;
    let variant = null;
    let timestamp = null;
    
    if (isValid) {
      try {
        version = getVersion(uuid);
        // UUID variant is determined by specific bits
        const variantBits = parseInt(uuid.charAt(19), 16);
        if (variantBits >= 8 && variantBits <= 11) variant = 1; // RFC 4122
        else if (variantBits >= 12 && variantBits <= 15) variant = 2; // Microsoft
        else if (variantBits >= 0 && variantBits <= 7) variant = 0; // NCS
        else variant = 3; // Future/Other

        // Get timestamp for v1 UUIDs
        if (version === 1) {
          timestamp = this.getTimestamp(uuid);
        }
      } catch {
        // Keep version and variant as null if parsing fails
      }
    }

    return {
      isValid,
      version,
      variant,
      isNil,
      timestamp
    };
  }

  generateBulk(count: number, version: UuidVersion, namespace?: string, name?: string): string[] {
    if (count < 1) {
      throw new Error('Count must be greater than 0');
    }

    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      // For v5, append counter to name to make each UUID unique
      const uniqueName = version === 'v5' ? `${name}-${i}` : name;
      uuids.push(this.generate(version, namespace, uniqueName));
    }
    return uuids;
  }

  getTimestamp(uuid: string): Date | null {
    try {
      if (!this.validate(uuid)) {
        return null;
      }

      const version = getVersion(uuid);
      if (version !== 1) {
        return null;
      }

      const parsed = parse(uuid);
      // Extract timestamp from v1 UUID
      const timeHigh = parsed[6] << 8 | parsed[7];
      const timeMid = parsed[4] << 8 | parsed[5];
      const timeLow = parsed[0] << 24 | parsed[1] << 16 | parsed[2] << 8 | parsed[3];
      
      // Combine timestamp parts and convert to milliseconds
      const timestamp = (timeHigh * Math.pow(2, 32) + timeMid * Math.pow(2, 16) + timeLow) / 10000;
      const gregorianOffset = 12219292800000; // Offset from Unix to Gregorian epoch
      
      return new Date(timestamp - gregorianOffset);
    } catch {
      return null;
    }
  }

  generateSequential(count: number, startTime: Date = new Date()): string[] {
    if (count < 1) {
      throw new Error('Count must be greater than 0');
    }

    const uuids: string[] = [];
    let time = startTime.getTime();

    for (let i = 0; i < count; i++) {
      // Generate v1 UUID with incrementing timestamp
      process.hrtime.bigint(); // Increment the internal counter
      const uuid = v1({ msecs: time });
      uuids.push(uuid);
      time += 1; // Increment by 1 millisecond
    }

    return uuids;
  }
} 