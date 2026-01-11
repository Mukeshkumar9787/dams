import { Tag } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = ({ }) => { 
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
        cursor: 'pointer'
    };
    return (
        <div>
            <div>

            {category && 
                <Tag
                key={category}
                closable
                style={style}
                className="cursor-pointer"
                onClick={() => handleClose('category')}
                >
                Category: {category}
                </Tag>
            }
            </div>
            <div>

            {size && 
                <Tag
                key={size}
                style={style}
                closable
                onClick={() => handleClose('size')}
                >
                Size: {size}
                </Tag>
            }
            </div>

            <div>

            {color && 
                <Tag
                key={color}
                style={style}
                onClick={() => handleClose('color')}
                >
                <span className="flex items-center justify-center">
                    <span>
                        Color:
                    </span>
                    <span key={color} className={`ml-3 w-8 h-8`} style={{backgroundColor: color}}>
                    </span>
                </span>
                </Tag>
            }
            </div>

        </div>
    )
}

export default Filter;