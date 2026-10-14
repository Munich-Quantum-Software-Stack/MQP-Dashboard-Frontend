/**
 * vendorConfig.js
 *
 * Single source of truth for vendor → logo/background-class mapping.
 * Imported by ResourceItem, ActiveResourceItem, MaintenanceResourceItem,
 * and the new InstitutionDetail component.
 *
 * Background classes resource_bg_1–resource_bg_8 are defined in Resources.scss.
 * resource_bg_9–resource_bg_14 are new classes also in Resources.scss.
 */

import IQM_logo from '@assets/images/IQM_logo.png';
import Eviden_logo from '@assets/images/eviden-logo.png';
import WMI_logo from '@assets/images/wmi-logo.svg';
import AQT_logo from '@assets/images/Logo-AQT.png';
import MuniQC_Atoms_logo from '@assets/images/MunicQC_Atoms.png';
import PlanQC_logo from '@assets/images/planqc_logo.png';

// ---------------------------------------------------------------------------
// Resource-name → vendor slot
// Keyed by the trimmed, lowercased resource name that components already use.
// Using ES6 Map so .get() is used for lookups — no bracket-notation on dynamic
// keys anywhere in this file.
// ---------------------------------------------------------------------------

/** Resource name (lowercase) → background CSS class */
const RESOURCE_NAME_TO_BG = new Map([
  ['qexa20', 'resource_bg_1'],
  ['q5', 'resource_bg_1'],
  ['q20', 'resource_bg_1'],
  ['eqe1', 'resource_bg_8'],
  ['qlm', 'resource_bg_2'],
  ['qaptiva', 'resource_bg_2'],
  ['wmi3', 'resource_bg_3'],
  ['aqt20', 'resource_bg_4'],
  ['muniqc-atoms20', 'resource_bg_5'],
  ['maqcs', 'resource_bg_7'],
]);

/** Resource name (lowercase) → logo import */
const RESOURCE_NAME_TO_LOGO = new Map([
  ['qexa20', IQM_logo],
  ['q5', IQM_logo],
  ['q20', IQM_logo],
  ['eqe1', IQM_logo],
  ['qlm', Eviden_logo],
  ['qaptiva', Eviden_logo],
  ['wmi3', WMI_logo],
  ['muniqc-atoms20', MuniQC_Atoms_logo],
  ['aqt20', AQT_logo],
  ['maqcs', PlanQC_logo],
]);

// ---------------------------------------------------------------------------
// Vendor name → background CSS class
// ---------------------------------------------------------------------------

/** Vendor name (lowercase) → background CSS class */
const VENDOR_NAME_TO_BG = new Map([
  ['iqm', 'resource_bg_1'],
  ['eviden', 'resource_bg_2'],
  ['wmi', 'resource_bg_3'],
  ['aqt', 'resource_bg_4'],
  ['muniqc-atoms', 'resource_bg_5'],
  ['planqc', 'resource_bg_7'],
  // New vendors (resource_bg_9–resource_bg_14)
  ['pasqal', 'resource_bg_9'],
  ['orca', 'resource_bg_10'],
  ['quandela', 'resource_bg_10'],
  ['ionq', 'resource_bg_4'], // Trapped Ions — shares gold palette
  ['quera', 'resource_bg_9'], // Neutral Atoms — lavender
  ['rigetti', 'resource_bg_1'], // Superconducting — orange
  ['eleqtron', 'resource_bg_14'], // DLR sky-blue
  ['xeedq', 'resource_bg_14'],
  ['ibm', 'resource_bg_12'],
  ['aws', 'resource_bg_13'],
]);

/** Vendor name (lowercase) → logo import */
const VENDOR_NAME_TO_LOGO = new Map([
  ['iqm', IQM_logo],
  ['eviden', Eviden_logo],
  ['wmi', WMI_logo],
  ['aqt', AQT_logo],
  ['muniqc-atoms', MuniQC_Atoms_logo],
  ['planqc', PlanQC_logo],
]);

// ---------------------------------------------------------------------------
// Technology → background CSS class (fallback when no vendor match)
// ---------------------------------------------------------------------------

/** QuantumTechnology → background CSS class */
export const TECHNOLOGY_TO_BG = new Map([
  ['Superconducting', 'resource_bg_1'],
  ['Trapped Ions', 'resource_bg_4'],
  ['Neutral Atoms', 'resource_bg_9'],
  ['Photonic', 'resource_bg_10'],
  ['Spin Qubit', 'resource_bg_11'],
  ['Simulator', 'resource_bg_2'],
  ['Unknown', 'resource_bg_6'],
]);

// ---------------------------------------------------------------------------
// Exported helpers
// ---------------------------------------------------------------------------

/**
 * Returns the CSS background class for a resource, using its name as the key.
 * Falls back to vendor, then technology.
 *
 * @param {string} resourceName - The resource's display name
 * @param {string} [vendorName] - Optional vendor name for fallback
 * @param {string} [technology] - Optional technology for final fallback
 * @returns {string} CSS class name
 */
export function getResourceBgClass(resourceName, vendorName, technology) {
  const nameLower = (resourceName || '').trim().toLowerCase();
  const byName = RESOURCE_NAME_TO_BG.get(nameLower);
  if (byName) return byName;

  const vendorLower = (vendorName || '').trim().toLowerCase();
  const byVendor = VENDOR_NAME_TO_BG.get(vendorLower);
  if (byVendor) return byVendor;

  const byTech = technology ? TECHNOLOGY_TO_BG.get(technology) : undefined;
  if (byTech) return byTech;

  return '';
}

/**
 * Returns the logo import src for a resource, using its name as the key.
 * Falls back to vendor. Returns null if no logo is available.
 *
 * @param {string} resourceName - The resource's display name
 * @param {string} [vendorName] - Optional vendor name for fallback
 * @returns {string|null}
 */
export function getResourceLogo(resourceName, vendorName) {
  const nameLower = (resourceName || '').trim().toLowerCase();
  const byName = RESOURCE_NAME_TO_LOGO.get(nameLower);
  if (byName) return byName;

  const vendorLower = (vendorName || '').trim().toLowerCase();
  const byVendor = VENDOR_NAME_TO_LOGO.get(vendorLower);
  if (byVendor) return byVendor;

  return null;
}

/**
 * Returns the CSS background class for a vendor name.
 *
 * @param {string} vendorName
 * @returns {string}
 */
export function getVendorBgClass(vendorName) {
  const vendorLower = (vendorName || '').trim().toLowerCase();
  return VENDOR_NAME_TO_BG.get(vendorLower) || '';
}

/**
 * Returns the logo src for a vendor name, or null.
 *
 * @param {string} vendorName
 * @returns {string|null}
 */
export function getVendorLogo(vendorName) {
  const vendorLower = (vendorName || '').trim().toLowerCase();
  return VENDOR_NAME_TO_LOGO.get(vendorLower) || null;
}

/**
 * Specialised logo size hints that some resource items use (e.g., WMI, MuniQC-Atoms).
 * @param {string} resourceName
 * @returns {{ height?: number } | {}}
 */
export function getLogoSizeHint(resourceName) {
  const nameLower = (resourceName || '').trim().toLowerCase();
  if (nameLower === 'wmi3') return { height: 50 };
  if (nameLower === 'muniqc-atoms20') return { height: 50 };
  return {};
}
