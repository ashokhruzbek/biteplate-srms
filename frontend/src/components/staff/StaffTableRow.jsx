import { formatDateTime, formatRoleLabel } from '../../utils/formatters'

function StaffTableRow({ member }) {
  const role = String(member.role || 'UNKNOWN').toLowerCase()

  return (
    <tr>
      <td>{member.fullName || '--'}</td>
      <td>{member.phoneNumber || '--'}</td>
      <td>
        <span className={`role-badge role-badge--${role}`}>
          {formatRoleLabel(member.role)}
        </span>
      </td>
      <td>{formatDateTime(member.createdAt)}</td>
    </tr>
  )
}

export default StaffTableRow
