import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx"; 

export default function Description(props){
    return(
        <div className="p-6 text-white ">
            <div className="flex justify-between"><h1 className="text-2xl font-bold">{props.problemData.id}. {props.problemData.name}</h1>
            {
                props.complete === 2? (
                <h1 className="text-md text-yellow-500">attempted</h1>
                ) : 
                props.complete === 1?(
                <h1 className="text-md text-green-500">completed</h1>
                ):(
                <h1 className="text-md text-cyan-400">unattempted</h1>
                )
            }
            </div>
            <p className="text-md p-3">{props.problemData.description}</p>
            
            <div className="p-3 my-3">{
                props.problemData.tests.slice(0,2).map((test,index)=>{
                return(
                    <div key={index} className="m-2">
                    <h1 className="text-xl font-bold text-zinc-300">Test {index+1}</h1>
                    <pre className="text-lg p-2 text-green-600 overflow-hidden">Input: <br/><pre className="my-3 text-lg bg-black p-3 rounded-lg text-white">{test.input}</pre></pre>
                    <pre className="text-md p-2 text-green-600 overflow-hidden">Output: <br /><pre className="my-3 text-lg bg-black p-3 rounded-lg text-white">{test.output}</pre></pre>
                    </div>
                )
                })
            }
            </div>
            
            <div>
                <h1 className="text-md font-bold my-2">Constraints</h1>
                <ul className="list-disc pl-6 text-md text-white space-y-1">
                    {props.problemData.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                    ))}
                </ul>
                <p className="mt-3 text-white">Acceptance: {props.problemData.acceptance}%</p>
            </div>


            <DropdownMenu >
                <DropdownMenuTrigger className="text-white bg-gray-900 p-2 border-[1px] border-gray-400 w-full my-4">Topics</DropdownMenuTrigger>
                <DropdownMenuContent  side="bottom"
                align="start"
                avoidCollisions={true}
                className="text-white bg-gray-900 p-2 border-[1px] border-gray-400 w-full">
                    {
                        props.problemData.tags.map((tag,index)=>{
                            return(
                                <DropdownMenuItem key={index} className="text-white bg-gray-900 p-2 w-full">{tag}</DropdownMenuItem>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
                
        </div>
    )
    
}