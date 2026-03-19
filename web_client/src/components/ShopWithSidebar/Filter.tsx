import { Tag } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = ({ clearFilter }) => { 
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const params = new URLSearchParams(searchParams.toString());
    const category = params.get('category');
    const color = params.get('color');
    const size = params.get('size');
    const handleClose = (type) => {
        params.delete(type);
        router.push(`${pathname}?${params.toString()}`);
    }
    const style = {
        fontSize: 14,
        padding: '8px 14px',
        borderRadius: 999,
        cursor: 'pointer',
        backgroundColor: 'white',
        border: '1px solid #dbe4f0',
        color: '#0f172a',
        fontWeight: 500,
    };
    if(!category && !color && !size) return <span></span>
    return (
        <div className="mb-4 flex max-w-full flex-wrap items-center gap-3 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:px-5">
            {category && 
                <Tag
                key={category}
                closable
                style={style}
                onClick={() => handleClose('category')}
                >
                <span className="font-">Category: </span> <span className="font-bold">{category}</span> 
                </Tag>
            }
            {size && 
                <Tag
                key={size}
                style={style}
                closable
                onClick={() => handleClose('size')}
                >
                <span className="font-">Size: </span> <span className="font-bold">{size}</span> 
                </Tag>
            }
            {color && 
                <Tag
                key={color}
                style={style}
                closable
                onClick={() => handleClose('color')}
                className="flex"
                >
                <span className="flex items-center justify-center rounded-lg">
                    <span> Color: </span>
                    <span key={color} className={`ml-2 h-5 w-5 rounded-full border border-slate-200`} style={{backgroundColor: color}}></span>
                </span>
                </Tag>
            }
            <button type="button" className="text-sm font-semibold text-blue" onClick={clearFilter}>Clear All Filters</button>
        </div>
    )
}

export default Filter;
