export default function icon({ icon, className }) {
 return (
  <span className={`material-symbols-rounded ${className}`}>
   {icon}
  </span>
 )
}