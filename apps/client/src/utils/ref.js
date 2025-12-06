// Helper to generate a simplified bank transfer reference from an order ID
// Example: orderId "abc123def456" -> "MB-DEF456"
export function formatTransferRef(orderId) {
  if (!orderId || typeof orderId !== 'string') return 'MB-REF';
  const clean = orderId.replace(/[^a-zA-Z0-9]/g, '');
  const tail = clean.slice(-6).toUpperCase();
  return `MB-${tail || 'REF'}`;
}
