// Untuk view status "terkirim"
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
    const params = useParams();
    const articleId = params.id;

    const article = {
        id: articleId,
        date: 'Senin, 12 Juli 2024',
        title: 'Sed ut perspiciatis unde omnis iste',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        image: '/path-to-image.jpg'
    };
    
    return (
        <div className="space-y-6">
          <h1 className="text-2xl font-medium">
            <span className="text-[#CF0000]">Kelola Artikel</span> | 
            <span className="text-black"> Lihat Artikel</span>
          </h1>
    
          {/* Article Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Article Image */}
              <div className="relative w-full h-[400px] bg-gray-100">
                <Image
                  src={article.image}
                  alt="Article cover"
                  fill
                  className="object-cover"
                />
              </div>
    
              {/* Article Info dan Content */}
              <div className="p-8 space-y-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
    
                {/* Title */}
                <h2 className="text-2xl font-semibold">
                  {article.title}
                </h2>
    
                {/* Content */}
                <div className="prose max-w-none text-gray-600 text-justify">
                  {article.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }