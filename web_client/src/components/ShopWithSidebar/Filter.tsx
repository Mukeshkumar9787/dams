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
        padding: '6px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: 'white',
    };
    if(!category && !color && !size) return <span></span>
    return (
        <div className="flex max-w-full rounded-lg py-4 px-5 items-center flex-wrap gap-3">
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
                    <span key={color} className={`ml-1 w-5 h-5`} style={{backgroundColor: color}}></span>
                </span>
                </Tag>
            }
            <button className="text-blue" onClick={clearFilter}>Clear All Filters</button>
        </div>
    )
}

export default Filter;