import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client.js";
import BlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
    return builder.image(source);
}

export default function OnePost() {
    const [postData, setPostData] = useState(null);
    const { slug } = useParams();
    console.log(sanityClient);
    useEffect(() => {
        sanityClient
            .fetch(
                `*[slug.current == $slug]{
          title,
          slug,
          mainImage{
            asset->{
              _id,
              url
             }
           },
         body,
        "name": author->name,
        "authorImage": author->image
       }`,
                { slug }
            )
            .then((data) => setPostData(data[0]))
            .catch(console.error);
    }, [slug]);

    if (!postData) return <div>Loading...</div>;

    return (
        <div className="bg-gray-200 min-h-screen p-12">
            <div className="container shadow-lg mx-auto bg-green-100 rounded-lg">
                <div className="relative">
                    <div className="absolute h-full w-full flex items-center justify-center p-8">
                        <div className="bg-white bg-opacity-75 rounded p-12">
                            <h2 className="cursive text-3xl lg:text-6xl mb-4">{postData.title}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <img
                className="w-full object-cover rounded-t"
                src={urlFor(postData.mainImage).url()}
                alt=""
                style={{ height: "400px" }} />
            <div className="px-16 lg:px-48 py-12 lg:py-20 prose lg:prose-xl max-w-full">
                <BlockContent
                    blocks={postData.body}
                    projectId='fgj6kryo'
                    dataset='production'
                />
            </div>
        </div>
    );
}