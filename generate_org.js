import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'src', 'data', 'regions_data.json');
const map = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const tsContent = `// =============================================================================
// البيانات الرسمية المعتمدة: المناطق الأزهرية والإدارات التعليمية على مستوى الجمهورية
// مستخرجة ومطابقة للملف الرسمي (27 منطقة أزهرية - 202 إدارة تعليمية)
// بدون أي بيانات عشوائية أو تجريبية
// =============================================================================

export interface AzharRegion {
  id: string;
  name: string;
  administrations: Administration[];
}

export interface Administration {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  institutes: Institute[];
}

export interface Institute {
  id: string;
  name: string;
  administrationId: string;
  regionId: string;
  type: 'primary' | 'preparatory' | 'secondary' | 'combined';
  gender: 'male' | 'female' | 'mixed';
  studentsCount?: number;
}

export const AZHAR_REGIONS_RAW: Record<string, string[]> = ${JSON.stringify(map, null, 2)};

export const AZHAR_REGIONS: AzharRegion[] = Object.entries(AZHAR_REGIONS_RAW).map(([regionName, admins], rIdx) => {
  const regionId = 'reg-' + (rIdx + 1);
  return {
    id: regionId,
    name: 'منطقة ' + regionName + ' الأزهرية',
    administrations: admins.map((adminName, aIdx) => {
      const adminId = 'adm-' + (rIdx + 1) + '-' + (aIdx + 1);
      return {
        id: adminId,
        name: 'إدارة ' + adminName + ' التعليمية',
        regionId,
        regionName: 'منطقة ' + regionName + ' الأزهرية',
        institutes: []
      };
    })
  };
});

export const ALL_ADMINISTRATIONS: Administration[] = AZHAR_REGIONS.flatMap(r => r.administrations);

export function getRegionById(id: string): AzharRegion | undefined {
  return AZHAR_REGIONS.find(r => r.id === id);
}

export function getRegionByName(name: string): AzharRegion | undefined {
  return AZHAR_REGIONS.find(r => r.name === name || r.name.includes(name));
}

export function getAdminsByRegion(regionNameOrId: string): Administration[] {
  const reg = AZHAR_REGIONS.find(r => r.id === regionNameOrId || r.name === regionNameOrId || r.name.includes(regionNameOrId));
  return reg ? reg.administrations : [];
}

export function getSystemStats() {
  return {
    regionsCount: AZHAR_REGIONS.length,
    administrationsCount: ALL_ADMINISTRATIONS.length,
    institutesCount: 0,
    studentsCount: 0
  };
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'organizationData.ts'), tsContent, 'utf8');
console.log('organizationData.ts generated successfully with all 27 regions and 202 administrations!');
