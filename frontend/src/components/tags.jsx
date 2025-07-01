"use client"
import  Link  from 'next/link';
import {useState} from 'react';

export default function Tags(props){
    const [expanded, setExpanded] = useState(false);
      const initialCount = 8;
    const {tags} = props;
      return (
        <div className="w-full bg-black flex flex-wrap gap-3 rounded-lg p-4">
            {
                tags.slice(0,initialCount).map((tag,index)=>{
                    return(
                        <Link href={`/problems/category/${tag.name}`} key={index}>
                        <div  className="text-white bg-gray-800 p-3 rounded-3xl hover:bg-gray-600 transition-all duration-100">
                            {tag.name}
                            <div className="inline-block bg-gray-900 rounded-2xl p-1 px-3 mx-2">{tag.total}</div>
                        </div>
                        </Link>
                    )
                })
            }
            {
                expanded && tags.slice(initialCount).map((tag,index)=>{
                    return(
                        <Link href={`/problems/category/${tag.name}`} key={index}>
                        <div  className="text-white bg-gray-800 p-3 rounded-3xl hover:bg-gray-600 transition-all duration-100">
                            {tag.name}
                            <div className="inline-block bg-gray-900 rounded-2xl p-1 px-3 mx-2">{tag.total}</div>
                        </div>
                        </Link>
                    )
                })
            }
            {
                !expanded ? (
                    <button onClick={() => setExpanded(true)}
                    className="text-blue-600 p-3">
                        expand +
                    </button>
                )
                : (
                    <button onClick={() => setExpanded(false)} 
                    className="text-blue-600 p-3">
                        collapse -
                    </button>
                )
            }
        </div>
      ); 
}