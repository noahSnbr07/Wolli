export default function icon({ icon, className }) {
 return (
  <span class={`material-symbols-outlined ${className}`}>
   {icon}
  </span>
 )
}