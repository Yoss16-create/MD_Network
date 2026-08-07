import { useState } from 'react'
import { useData } from '../context/DataContext'

const formatRupiah = (n:number) =>
  'Rp ' + n.toLocaleString('id-ID')


export default function Payments(){

const { payments } = useData()


const [search,setSearch] = useState('')
const [selectedPay,setSelectedPay] = useState<any>(null)
const [activeTab,setActiveTab] = useState('all')


const filtered = payments
.filter((p)=>
!search ||
p.name.toLowerCase().includes(search.toLowerCase()) ||
p.no.toLowerCase().includes(search.toLowerCase())
)
.filter((p)=>
activeTab==='all'
?
true
:
p.method===activeTab
)



const printReceipt=(p:any)=>{

const w = window.open(
'',
'_blank',
'width=400,height=600'
)


if(w){

w.document.write(`

<html>

<body style="
font-family:sans-serif;
padding:20px;
color:#1e293b;
">

<h2 style="
text-align:center;
">
MD_Network
</h2>


<h3 style="
text-align:center;
">
Kwitansi Pembayaran
</h3>


<hr/>


<p>
<b>No:</b> ${p.no}
</p>


<p>
<b>Pelanggan:</b> ${p.name}
</p>


<p>
<b>Metode:</b> ${p.method}
</p>


<p>
<b>Nominal:</b> ${formatRupiah(p.amount)}
</p>


<p>
<b>Status:</b> ${p.status}
</p>


<script>
setTimeout(()=>window.print(),300)
</script>


</body>

</html>

`)


w.document.close()

}

}



return (

<div className="
w-full
p-4
md:p-8
space-y-6
">


<div>

<h1 className="
text-2xl
md:text-3xl
font-bold
text-slate-800
">

Semua Pembayaran

</h1>


<p className="
text-sm
text-slate-500
mt-1
">

Data transaksi pembayaran pelanggan MD_Network

</p>


</div>


<div className="
bg-white
rounded-xl
border
border-slate-200
p-4
">


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Cari pelanggan..."

className="
w-full
px-4
py-3
rounded-lg
border
border-slate-200
outline-none
"

/>

</div>


<div className="
flex
gap-3
overflow-x-auto
">


{
[
'all',
'Transfer Bank',
'QRIS',
'Tunai'
].map((t)=>(


<button

key={t}

onClick={()=>setActiveTab(t)}

className={`
px-4
py-2
rounded-lg
text-sm
font-bold
whitespace-nowrap

${
activeTab===t
?
'bg-primary text-white'
:
'bg-slate-100 text-slate-600'
}

`}

>

{t}

</button>


))

}


</div>
<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-4
">


{filtered.map((p)=>(

<div
key={p.no}
className="
bg-white
rounded-xl
border
border-slate-200
p-5
shadow-sm
hover:shadow-md
transition
"
>


<div className="
flex
justify-between
items-center
mb-4
">


<div className="
w-10
h-10
rounded-full
bg-blue-100
flex
items-center
justify-center
font-bold
text-blue-600
">

{p.initials}

</div>


<span className="
text-xs
font-bold
px-3
py-1
rounded-full
bg-green-100
text-green-600
">

{p.status}

</span>


</div>



<h2 className="
font-bold
text-slate-800
text-lg
">

{p.name}

</h2>


<p className="
text-sm
text-slate-500
">

{p.no}

</p>



<div className="
mt-4
space-y-2
text-sm
">


<p>
Metode : {p.method}
</p>


<p>
Bank : {p.bank}
</p>


<p>
Tanggal : {p.date}
</p>


<p className="
font-bold
text-primary
text-lg
">

{formatRupiah(p.amount)}

</p>


</div>



<div className="
mt-5
flex
gap-2
">


<button

onClick={()=>setSelectedPay(p)}

className="
flex-1
py-2
rounded-lg
bg-slate-100
font-bold
text-sm
">

Detail

</button>



<button

onClick={()=>printReceipt(p)}

className="
flex-1
py-2
rounded-lg
bg-primary
text-white
font-bold
text-sm
">

Cetak

</button>


</div>


</div>


))}


</div>



{selectedPay && (

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
">


<div className="
bg-white
rounded-xl
p-6
w-[90%]
max-w-md
">


<h2 className="
font-bold
text-xl
mb-4
">

Detail Pembayaran

</h2>


<p>Nama : {selectedPay.name}</p>

<p>No : {selectedPay.no}</p>

<p>
Jumlah : {formatRupiah(selectedPay.amount)}
</p>


<button

onClick={()=>setSelectedPay(null)}

className="
mt-5
w-full
bg-primary
text-white
py-2
rounded-lg
font-bold
">

Tutup

</button>


</div>

</div>

)}


</div>

)

}